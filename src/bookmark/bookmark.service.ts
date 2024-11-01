import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBookmarkDto,
  EditBookmarkDto,
} from './dto';
import * as fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
    });
  }

  getBookmarkById(
    userId: number,
    bookmarkId: number,
  ) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId: userId,
      },
    });
  }

  async createBookmark(
    userId: number,
    dto: CreateBookmarkDto,
    file?: Express.Multer.File,
  ) {
    const bookmarkData = {
       userId:  userId,
      ...dto,
    };

    if (file) {
      bookmarkData.fileUrl = `uploads/${file.filename}`;
      bookmarkData.fileName = file.originalname;
      bookmarkData.fileType = file.mimetype;
    }

    const bookmark = await this.prisma.bookmark.create({
      data: bookmarkData,
    });

    return bookmark;
  }

  async updateBookmarkById(
    userId: number, // Güncelleme yapmak isteyen kullanıcının ID'si
    bookmarkId: number, // Güncellenecek bookmark'ın ID'si
    dto: EditBookmarkDto, // Güncelleme için gönderilen yeni bookmark verisi
    file?: Express.Multer.File, // Opsiyonel olarak yüklenen yeni dosya
  ) {
    // Veritabanında güncellenmek istenen bookmark'ı ID'ye göre bulur
    const existingBookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });
  
    // Eğer bookmark bulunamazsa veya kullanıcının erişimi yoksa hata fırlatır
    if (!existingBookmark || existingBookmark.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }
  
    // Eğer mevcut bookmark'ta bir dosya varsa
    if (existingBookmark.fileUrl) {
      // Dosya yolunu 'uploads/' dizininden alır ve sadece dosya ismini çıkarır
      const filePath = existingBookmark.fileUrl.replace('uploads/', '');
      try {
        // Eski dosyayı sunucudan silmeye çalışır
        await unlinkAsync(`uploads/${filePath}`);
      } catch (error) {
        // Dosya silme sırasında bir hata olursa konsola loglar
        console.error('Error deleting file:', error);
      }
    }
  
    // Yeni bookmark verisini içeren bir nesne oluşturur
    const bookmarkData = {
      ...dto, // DTO'dan gelen güncellemeleri ekler
    };
  
    // Eğer yeni bir dosya yüklendiyse, dosya bilgilerini `bookmarkData` nesnesine ekler
    if (file) {
      bookmarkData.fileUrl = `uploads/${file.filename}`; // Yeni dosya yolunu kaydeder
      bookmarkData.fileName = file.originalname; // Dosyanın orijinal adını kaydeder
      bookmarkData.fileType = file.mimetype; // Dosyanın türünü kaydeder
    } else {
      // Yeni dosya yoksa eski dosya bilgilerini null yapar
      bookmarkData.fileUrl = null;
      bookmarkData.fileName = null;
      bookmarkData.fileType = null;
    }
  
    // Güncellenmiş veriyi kullanarak veritabanında bookmark'ı günceller
    const bookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: bookmarkData,
    });
  
    // Güncellenmiş bookmark'ı döndürür
    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    // get the bookmark by id
    const bookmark =
      await this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(
    userId: number,
    bookmarkId: number,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    if (bookmark.fileUrl) {
      const filePath = bookmark.fileUrl.replace('uploads/', '');
      try {
        await unlinkAsync(`uploads/${filePath}`);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }

  async assignBookmarkToUser(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.update({
      where: { id: bookmarkId },
      data: { userId: userId },
    });
  }
}
