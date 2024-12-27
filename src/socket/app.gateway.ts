import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { use } from 'passport';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { set } from 'pactum/src/exports/state';
import axios from 'axios';


//"namspace" ile client tarafında hangi namespace'i dinleyeceğimizi bel
@WebSocketGateway({ namespace:"/Socket", cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;


   private simulatedLocations: [number, number][] = [
    [41.043, 29.007],  // Beşiktaş
  
    [41.038, 29.035],  // Kabataş
    [41.035, 29.045],  // Üsküdar
    [41.032, 29.058],  // Kuzguncuk
    [41.028, 29.073],  // Beylerbeyi
    [41.024, 29.085],  // Çengelköy
    [41.020, 29.095],  // Vaniköy
    [41.017, 29.105],  // Kandilli
    [41.012, 29.120],  // Ataşehir
    [41.002, 29.130],  // Küçükbakkalköy
    [40.990, 29.136],  // İçerenköy
    [40.970, 29.140],  // Küçükyalı
    [40.950, 29.145],  // İdealtepe
    [40.935, 29.150],  // Cevizli
    [40.922, 29.152],  // Maltepe
    [40.915, 29.160],  // Başıbüyük
    [40.905, 29.175],  // Gülensu
    [40.895, 29.190],  // Kartal
    [40.885, 29.205],  // Yakacık
    [40.880, 29.215],  // Samandıra
    [40.878, 29.220],  // Kurtköy
    [40.876, 29.229],  // Pendik
  ];
  private locationIndex = 0;
  private recivedLocations = [];
  private intervalId: NodeJS.Timeout;
  private setDataIntervalId: NodeJS.Timeout;
  private count: number = 0; 
  constructor(
    @Inject(forwardRef(() => CategoriesService))
    private readonly CategoryService:CategoriesService
  ) { }

 


  //DİKKAT!
  //Buradaki handleConnection ve handleDisconnect fonksiyonları client bağlantısı ve bağlantı kesildiğinde çalışacak fonksiyonlardır.
  //handleConnetction fonksiyonu client bağlandığında sadece 1 kere çalışır. handleDisconnect fonksiyonu ise client bağlantısı kesildiğinde 1 kere çalışır.
  //Bunların isimleri değiştirilemez. çünkü bunlar interface'den geliyor.
  async handleConnection (client: Socket) {
    console.log(`Client connected: ${client.id}`);

    //Ankara ve Eskişehir koordinatları
    // const userLocation = { latitude: "", longitude: "" }; // Kullanıcının konumu
    // const ankara = { latitude: 39.92077, longitude: 32.85411 }; // Ankara'nın koordinatları
    // const eskisehir = { latitude: 39.7765, longitude: 30.5200 }; // Eskişehir'in koordinatları
    // const steps = 70; // 70 adımda gitmesini istiyoruz
    // let step = 0; // Adım sayısı
    // // Her 2 saniyede bir adım at
    // const intervalId = setInterval(() => {
    //   const latitudeDiff = (eskisehir.latitude - ankara.latitude) / steps;
    //   const longitudeDiff = (eskisehir.longitude - ankara.longitude) / steps;
    //   // Yeni konum
    //   const newLocation = {
    //     latitude: ankara.latitude + latitudeDiff * step,
    //     longitude: ankara.longitude + longitudeDiff * step,
    //   };
    //   console.log('Sending new location:', newLocation); // Veriyi kontrol et
    //   client.emit('ankara', newLocation);
    //   step++; // Adımı artır
    //   if (step >= steps) {
    //     clearInterval(intervalId); // Hedefe ulaşıldığında interval'ı durdur
    //   }
    // }, 2000); // 2 saniyede bir adım
    // client['locationIntervalId'] = intervalId;

    //----------------------Kategoriler bilgisini alıp, tekrar gönderen fonksiyon----------------------

      const data = await this.CategoryService.getCategories();
      client.emit('data', data);

      setInterval(() => {
        if (this.locationIndex >= this.simulatedLocations.length) {
          console.log("Rota tamamlandı");
          
          this.recivedLocations = [];
          console.log(this.recivedLocations)
          this.locationIndex = 0;
        } else if (this.locationIndex < this.simulatedLocations.length) {
          const location = this.simulatedLocations[this.locationIndex];
          this.recivedLocations.push(location);
          
          this.updateRoute(this.recivedLocations, client);
          this.locationIndex++;
        }
      }, 5000);
  }



  private updateRoute = async (locations: [number, number][], client: Socket) => {
    if (this.recivedLocations.length < 2) return; // En az 2 nokta olmadan rota hesaplanamaz

    console.log("kornidatlat geldi",this.locationIndex);

    // OSRM API'si için koordinatları string formatına çevirme
    console.log("kornidatlat geldi",this.recivedLocations);
    const coordinateString = this.recivedLocations.map(([lat, lon]) => `${lon},${lat}`).join(';');
 
    const link = `http://20.86.22.168:5000/route/v1/driving/${coordinateString}?overview=full&geometries=geojson`;

    try {
      const response = await axios.get(link);
      if (response.data.code === 'Ok') {
        // API'den gelen koordinatları Leaflet'in anlayacağı formata çevirme
        const coordinates = response.data.routes[0].geometry.coordinates;
        const formattedRoute = coordinates.map(([lon, lat]: [number, number]) => [lat, lon]);
        client.emit('route', formattedRoute);
        console.log("formattedRoute",formattedRoute);
        
      }
    } catch (error) {
      console.error('Rota güncellenirken hata:', error);
    }
  };



  @SubscribeMessage('createRoom')
  handleCreateRoom(client: Socket){
    console.log("Room created");
    console.log(client.id);
    // client.join("room1");
  }

  //Client tarafından "data" event'i tetiklendiğinde çalışacak fonksiyon
  //Bu sayede client tarafından server a veri gönderilebilir.
  @SubscribeMessage('data')
  handleDataEvent(@MessageBody() message: string, @ConnectedSocket() client: Socket) {
    console.log(`Received data from ${client.id}:`, message);
    if (client && client.emit) {
      client.emit('response', { status: 'Success', received: message });
    } else {
      console.error('Client is not connected or emit function is undefined.');
    }
  }

  // //Canlı konum bilgisini alıp, tekrar client'a gönderen fonksiyon
  // @SubscribeMessage('userLocation')
  // handleLocationEvent(@MessageBody() message: { latitude: number, longitude: number }, @ConnectedSocket() client: Socket) {
  //   const { latitude, longitude } = message;
  //   console.log(`Received location: Latitude - ${latitude}, Longitude - ${longitude}`);

    
  //   // Mesajı tekrar client'a gönderelim
  //    client.emit('locationReceived', { status: 'Success', latitude, longitude });
  // }


  //------------------------Canlı Chat Uygulaması------------------------

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: { username: string; room: string }) {
    const { username, room } = payload;

    client.join(room);
    console.log(`${username} joined room: ${room}`);

    // Odaya katılım mesajı gönder
    this.server.to(room).emit('message', { username: 'System', text: `${username} has joined the room!` });
  }

  // Mesaj gönderme
  @SubscribeMessage('sendMessage')
  handleSendMessage(client: Socket, payload: { username: string; room: string; text: string }) {
    const { username, room, text } = payload;

    console.log(`Message from ${username} in ${room}: ${text}`);

    // Odaya mesaj yayını
    this.server.to(room).emit('message', { username, text });
  }

 

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    
    // Client bağlantısı kesildiğinde interval'ı durdur
    if (client['locationIntervalId']) {
      clearInterval(client['locationIntervalId']);
    }
  }
}
