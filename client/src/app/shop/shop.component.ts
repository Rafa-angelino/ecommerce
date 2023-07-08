import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/models/product';
import { ShopService } from './shop.service';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  brands: Brand[] = [];
  types: Type[] = []
  brandIdSelected = 0;
  typeIdSelected = 0;
  sortSelected ='name';
  sortOptions= [
    {name: 'Ordem alfabética', value: 'name'},
    {name: 'Preço: Do menor ao Maior', value: 'priceAsc'},
    {name: 'Preço: Do maior para o menor', value: 'priceDesc'}
  ]


  constructor(private service: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    this.service.getProducts(this.brandIdSelected, this.typeIdSelected, this.sortSelected).subscribe({
      next: (response) =>  this.products = response.data,
      error: error => console.log(error)
    })
  }

  getBrands() {
    this.service.getBrands().subscribe({
      next: (response) =>  this.brands = [{id: 0, name: 'Todos'}, ...response], //coloca o tipo 'todos' em primeiro além das brands pegas da api
      error: error => console.log(error)
    })
  }

  getTypes() {
    this.service.getTypes().subscribe({
      next: (response) =>  this.types = [{id: 0, name: 'Todos'}, ...response],
      error: error => console.log(error)
    })
  }

  onBrandSelected(brandId: number) {
    this.brandIdSelected = brandId;
    this.getProducts()
  }

  onTypeSelected(typeId: number) {
    this.typeIdSelected = typeId;
    this.getProducts();
  }

  onSortSelected(event: any) {
    this.sortSelected = event.target.value;
    this.getProducts();
  }

}
