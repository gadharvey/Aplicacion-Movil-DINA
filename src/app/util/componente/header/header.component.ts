import { Component, inject, Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  //para volverlo reutilizable se utiliza la propiedad Input
  @Input() titulo!: string;
  @Input() backButton!: string;
  @Input() isModal!: boolean;
  @Input() showMenu!: boolean;

  utilsSvc=inject(UtilsService); 


  constructor() { }

  ngOnInit() {}


  dismissmodal(){
      this.utilsSvc.dismissmodal();
  }

}
