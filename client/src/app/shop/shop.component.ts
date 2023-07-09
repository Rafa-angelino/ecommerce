import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../shared/models/product';
import { ShopService } from './shop.service';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shoppingParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search') searchTerm?: ElementRef
  products: Product[] = [];
  brands: Brand[] = [];
  types: Type[] = []
  shopParam = new ShopParams()
  sortOptions= [
    {name: 'Ordem alfabética', value: 'name'},
    {name: 'Preço: Do menor ao Maior', value: 'priceAsc'},
    {name: 'Preço: Do maior para o menor', value: 'priceDesc'},

  ];
  totalCount = 0;

  constructor(private service: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    this.service.getProducts(this.shopParam).subscribe({
      next: (response) => {
        this.products = response.data;
        this.shopParam.pageNumber = response.pageIndex;
        this.shopParam.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
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
    this.shopParam.brandId = brandId;
    this.shopParam.pageNumber = 1; // fix : sempre quando trocar o filtro ele iniciar na pageNumber(pageIndex) igual a 1
    this.getProducts()
  }

  onTypeSelected(typeId: number) {
    this.shopParam.typeId = typeId;
    this.shopParam.pageNumber = 1; // fix : sempre quando trocar o filtro ele iniciar na pageNumber(pageIndex) igual a 1
    this.getProducts();
  }

  onSortSelected(event: any) {
    this.shopParam.sort = event.target.value;
    this.getProducts();
  }

  onPageChange(event: any) {
    if(this.shopParam.pageNumber !== event) {
      this.shopParam.pageNumber = event;
      this.getProducts();
    }
  }

  onSearch() {
    this.shopParam.search = this.searchTerm?.nativeElement.value;
    this.getProducts();
  }

  onReset() {
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.shopParam = new ShopParams();
    this.getProducts();
  }

}
