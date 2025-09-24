import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma/prisma.service";
import { UpdateUserDto } from "./dto/user.dto";
import { Prisma } from "@prisma/client";
import HttpException from "src/common/exceptions/http-exception.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (error) {
      throw HttpException.internalServerError("Failed to fetch users");
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw HttpException.notFound("User not found");
      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw HttpException.internalServerError("Failed to fetch user");
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw HttpException.notFound("User not found");

      return await this.prisma.user.update({
        where: { id },
        data: { ...dto },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            throw HttpException.conflict("Email already in use");
          case "P2003":
            throw HttpException.badRequest("Invalid relation reference");
        }
      }

      throw HttpException.internalServerError("Failed to update user");
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw HttpException.notFound("User not found");

      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          throw HttpException.badRequest(
            "Cannot delete user because of related records"
          );
        }
      }

      throw HttpException.internalServerError("Failed to delete user");
    }
  }
}
