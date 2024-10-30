import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    const users = await this.prisma.user.findMany({
      include: {
        bookmarks: true,
      },
    });
    return users;
  }

  async editUser(userId: number, dto: EditUserDto) {
    // Tek bir update işlemi ile hem kullanıcıyı güncelle hem de bookmark'ları değiştir
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
        bookmarks: {
          // Önce mevcut bookmark'ları sil
          deleteMany: {
            userId: userId
          },
          // Sonra yenilerini oluştur (eğer varsa)
          create: dto.bookmarks || []
        },
      },
      include: {
        bookmarks: true,
      },
    });

    delete user.hash;
    return user;
  }

  // Burada bir Nested Writes (İlişkisel Yazma) yapıyoruz. Yani kullanıcı oluştururken, kullanıcıya ait bookmark'ları da birlikte oluşturabiliriz.
  // Burada dto.bookmarks ile dto'daki bookmarks'ı oluşturuyoruz.
  async createUser(dto: CreateUserDto) {
    const hash = await argon.hash(dto.password);
    
    // dto'dan password'ü çıkarıp, yerine hash'i koyalım
    const { password, ...userData } = dto;
    console.log(dto);
    const user = await this.prisma.user.create({
      data: {
        ...userData,  // password hariç diğer alanlar
        hash,         // hashlenmiş şifre
        bookmarks: {
          create: dto.bookmarks,
        },
      },
      include: {
        bookmarks: true,
      },
    });

    return user;
  }

  async updateUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        bookmarks: {
          create: dto.bookmarks,
        },
      },
    });
    return user;
  }
}
