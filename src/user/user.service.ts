import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { unlinkAsync } from 'fs-extra';

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
  async createUser(dto: CreateUserDto, files?: Express.Multer.File[]) {
    const hash = await argon.hash(dto.password);
    const { password, bookmarks, ...userData } = dto;



    // Bookmark'ları ve dosyaları eşleştir
    const bookmarksWithFiles = bookmarks?.map((bookmark, index) => {
      const file = files?.[index];
      console.log(`Processing bookmark ${index} with file:`, file);  // Her bookmark için dosya eşleştirmesini logla

      return {
        ...bookmark,
        fileUrl: file ? `uploads/${file.filename}` : null,
        fileName: file ? file.originalname : null,
        fileType: file ? file.mimetype : null,
      };
    });

    console.log('Bookmarks with files:', bookmarksWithFiles);  // Debug için son halini logla

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        hash,
        bookmarks: {
          create: bookmarksWithFiles,
        },
      },
      include: {
        bookmarks: true,
      },
    });

    delete user.hash;
    return user;
  }

  async updateUser(userId: number, dto: EditUserDto, files?: Express.Multer.File[]) {
    const { bookmarks, ...userData } = dto;

    // Bookmark'ları ve dosyaları eşleştir
    const bookmarksWithFiles = bookmarks?.map((bookmark, index) => {
      const file = files?.[index];
      console.log(`Processing bookmark ${index} with file:`, file);

      return {
        ...bookmark,
        fileUrl: file ? `uploads/${file.filename}` : null,
        fileName: file ? file.originalname : null,
        fileType: file ? file.mimetype : null,
      };
    });

    // Önce mevcut bookmark'ların dosyalarını sil
    const existingBookmarks = await this.prisma.bookmark.findMany({
      where: { userId: userId }
    });

    // Mevcut dosyaları sil
    for (const bookmark of existingBookmarks) {
      if (bookmark.fileUrl) {
        const filePath = bookmark.fileUrl.replace('uploads/', '');
        try {
          await unlinkAsync(`uploads/${filePath}`);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
    }

    // Kullanıcıyı ve bookmark'ları güncelle
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...userData,
        bookmarks: {
          deleteMany: {}, // Önce tüm bookmark'ları sil
          create: bookmarksWithFiles || [], // Sonra yenilerini oluştur
        },
      },
      include: {
        bookmarks: true,
      },
    });

    delete user.hash;
    return user;
  }
}
