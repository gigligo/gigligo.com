import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { PrismaService } from '../prisma/prisma.service';
import { Request, Response } from 'express';

@Injectable()
export class McpService implements OnModuleInit {
    private server: Server;
    private transports: Map<string, SSEServerTransport> = new Map();

    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        this.server = new Server({
            name: "gigligo-mcp",
            version: "1.0.0"
        }, {
            capabilities: { tools: {} }
        });

        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: "getJobs",
                        description: "Get all active jobs on the platform",
                        inputSchema: { type: "object", properties: {} }
                    },
                    {
                        name: "getFreelancers",
                        description: "Get a list of all freelancers",
                        inputSchema: { type: "object", properties: {} }
                    },
                    {
                        name: "getGigs",
                        description: "Get all active gigs on the platform",
                        inputSchema: { type: "object", properties: {} }
                    },
                    {
                        name: "createProposal",
                        description: "Create a job proposal for a freelancer",
                        inputSchema: {
                            type: "object",
                            properties: {
                                freelancerId: { type: "string" },
                                jobId: { type: "string" },
                                coverLetter: { type: "string" }
                            },
                            required: ["freelancerId", "jobId", "coverLetter"]
                        }
                    },
                    {
                        name: "createGig",
                        description: "Create a new gig for a seller",
                        inputSchema: {
                            type: "object",
                            properties: {
                                sellerId: { type: "string" },
                                title: { type: "string" },
                                description: { type: "string" },
                                category: { type: "string" },
                                priceStarter: { type: "number" }
                            },
                            required: ["sellerId", "title", "description", "category", "priceStarter"]
                        }
                    },
                    {
                        name: "getUserProfile",
                        description: "Get profile information for a user",
                        inputSchema: {
                            type: "object",
                            properties: {
                                userId: { type: "string" }
                            },
                            required: ["userId"]
                        }
                    },
                    {
                        name: "getWalletBalance",
                        description: "Get the wallet balance for a user",
                        inputSchema: {
                            type: "object",
                            properties: {
                                userId: { type: "string" }
                            },
                            required: ["userId"]
                        }
                    }
                ]
            };
        });

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                if (name === "getJobs") {
                    const jobs = await this.prisma.job.findMany({ where: { status: 'OPEN' } });
                    return { content: [{ type: "text", text: JSON.stringify(jobs, null, 2) }] };
                }
                if (name === "getFreelancers") {
                    const freelancers = await this.prisma.user.findMany({
                        where: { role: { in: ['SELLER', 'STUDENT'] } },
                        include: { profile: true }
                    });
                    return { content: [{ type: "text", text: JSON.stringify(freelancers, null, 2) }] };
                }
                if (name === "getGigs") {
                    const gigs = await this.prisma.gig.findMany({ where: { isActive: true } });
                    return { content: [{ type: "text", text: JSON.stringify(gigs, null, 2) }] };
                }
                if (name === "createProposal") {
                    const app = await this.prisma.jobApplication.create({
                        data: {
                            freelancerId: (args as any).freelancerId,
                            jobId: (args as any).jobId,
                            coverLetter: (args as any).coverLetter
                        }
                    });
                    return { content: [{ type: "text", text: JSON.stringify(app, null, 2) }] };
                }
                if (name === "createGig") {
                    const gig = await this.prisma.gig.create({
                        data: {
                            sellerId: (args as any).sellerId,
                            title: (args as any).title,
                            description: (args as any).description,
                            category: (args as any).category,
                            priceStarter: (args as any).priceStarter || 0,
                            priceStandard: (args as any).priceStarter || 0,
                            pricePremium: (args as any).priceStarter || 0,
                            deliveryTimeStarter: 3,
                            deliveryTimeStandard: 3,
                            deliveryTimePremium: 3,
                        }
                    });
                    return { content: [{ type: "text", text: JSON.stringify(gig, null, 2) }] };
                }
                if (name === "getUserProfile") {
                    const profile = await this.prisma.profile.findUnique({ where: { userId: (args as any).userId } });
                    return { content: [{ type: "text", text: JSON.stringify(profile, null, 2) }] };
                }
                if (name === "getWalletBalance") {
                    const wallet = await this.prisma.wallet.findUnique({ where: { userId: (args as any).userId } });
                    return { content: [{ type: "text", text: JSON.stringify(wallet, null, 2) }] };
                }

                throw new Error(`Unknown tool: ${name}`);
            } catch (error: any) {
                return { content: [{ type: "text", text: `Error executing ${name}: ${error.message}` }] };
            }
        });
    }

    async handleSse(req: Request, res: Response) {
        const transport = new SSEServerTransport("/api/mcp/messages", res);
        await this.server.connect(transport);
        const sessionId = transport.sessionId;
        this.transports.set(sessionId, transport);

        req.on('close', () => {
            this.transports.delete(sessionId);
        });
    }

    async handlePostMessage(req: Request, res: Response) {
        const sessionId = req.query.sessionId as string;
        const transport = this.transports.get(sessionId);

        if (!transport) {
            res.status(404).json({ error: "Session not found" });
            return;
        }
        // Pass the already-parsed body from NestJS to the MCP SDK
        await transport.handlePostMessage(req, res, req.body);
    }
}
