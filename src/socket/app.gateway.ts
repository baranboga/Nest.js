import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CategoriesService } from 'src/categories/categories.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private intervalId: NodeJS.Timeout;
  private setDataIntervalId: NodeJS.Timeout;
  private count: number = 0; 
  constructor( private readonly CategoryService:CategoriesService ) { }


  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Ankara ve Eskişehir koordinatları
    const ankara = { latitude: 39.92077, longitude: 32.85411 }; // Ankara'nın koordinatları
    const eskisehir = { latitude: 39.7765, longitude: 30.5200 }; // Eskişehir'in koordinatları
    const steps = 70; // 70 adımda gitmesini istiyoruz
    let step = 0; // Adım sayısı
    // Her 2 saniyede bir adım at
    const intervalId = setInterval(() => {
      const latitudeDiff = (eskisehir.latitude - ankara.latitude) / steps;
      const longitudeDiff = (eskisehir.longitude - ankara.longitude) / steps;
      // Yeni konum
      const newLocation = {
        latitude: ankara.latitude + latitudeDiff * step,
        longitude: ankara.longitude + longitudeDiff * step,
      };
      console.log('Sending new location:', newLocation); // Veriyi kontrol et
      client.emit('yaso', newLocation);
      step++; // Adımı artır
      if (step >= steps) {
        clearInterval(intervalId); // Hedefe ulaşıldığında interval'ı durdur
      }
    }, 2000); // 2 saniyede bir adım
    client['locationIntervalId'] = intervalId;

    this.setDataIntervalId= setInterval(async () => {
      const data = await this.CategoryService.getCategories();
      client.emit('data', data);
    }, 2000);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    
    // Client bağlantısı kesildiğinde interval'ı durdur
    if (client['locationIntervalId']) {
      clearInterval(client['locationIntervalId']);
    }
  }
}
