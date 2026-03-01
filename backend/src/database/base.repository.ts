import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Base data access repository.
 * Encapsulates Prisma logic so services don't depend directly on the ORM.
 */
@Injectable()
export abstract class BaseRepository<T, CreateInput, UpdateInput, WhereInput> {
    constructor(
        protected readonly prisma: PrismaService,
        protected readonly modelName: string
    ) { }

    protected get model(): any {
        return this.prisma[this.modelName];
    }

    async findUnique(where: WhereInput, include?: any): Promise<T | null> {
        return this.model.findUnique({ where, include });
    }

    async findFirst(where: WhereInput, include?: any): Promise<T | null> {
        return this.model.findFirst({ where, include });
    }

    async findMany(params: {
        skip?: number;
        take?: number;
        cursor?: WhereInput;
        where?: WhereInput;
        orderBy?: any;
        include?: any;
    }): Promise<T[]> {
        return this.model.findMany(params);
    }

    async create(data: CreateInput, include?: any): Promise<T> {
        return this.model.create({ data, include });
    }

    async update(where: WhereInput, data: UpdateInput, include?: any): Promise<T> {
        return this.model.update({ where, data, include });
    }

    async delete(where: WhereInput): Promise<T> {
        return this.model.delete({ where });
    }

    async count(where?: WhereInput): Promise<number> {
        return this.model.count({ where });
    }

    /**
     * Executes logic inside a Prisma transaction block.
     */
    async transaction<R>(fn: (tx: PrismaService) => Promise<R>): Promise<R> {
        return this.prisma.$transaction(async (tx) => {
            return fn(tx as PrismaService);
        }) as unknown as Promise<R>;
    }
}
