import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

@Injectable()
export class AiService implements OnModuleInit {
    private mcpClient: Client;
    private transport: SSEClientTransport;

    constructor() { }

    async onModuleInit() {
        // Initialize the MCP Client
        this.mcpClient = new Client({
            name: "gigligo-ai-service",
            version: "1.0.0"
        }, {
            capabilities: {}
        });

        // We defer actual connection to when a request is made or handle it asynchronously
        // as the local server needs to be fully listening first.
        this.connectToLocalMcp().catch(console.error);
    }

    private async connectToLocalMcp() {
        // Wait briefly for the NestJS server to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            // url must be absolute for SSEClientTransport
            const url = new URL('http://localhost:3000/api/mcp/sse');
            this.transport = new SSEClientTransport(url);

            await this.mcpClient.connect(this.transport);
            console.log("AI Service successfully connected to local MCP Server");

            // Example: const tools = await this.mcpClient.listTools();
        } catch (error) {
            console.error("Failed to connect AI Service to MCP Server:", error);
        }
    }

    async processUserRequest(prompt: string) {
        if (!this.transport) {
            throw new Error("MCP Client not connected");
        }

        // Fetch available tools from our MCP server
        const toolsResponse = await this.mcpClient.listTools();

        return {
            message: `Received prompt: "${prompt}". Ready to process with AI.`,
            availableTools: toolsResponse.tools.map(t => t.name)
        };
    }
}
