import { Component, OnInit } from '@angular/core';
import { ShopService } from '../shop.service';
import { Product } from 'src/app/shared/models/product';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;

  constructor(private shopService: ShopService, private activatedRoute: ActivatedRoute,
    private bcService: BreadcrumbService){
      this.bcService.set('@productDetails', ' '); //inicializa como vazio ao carregar a página para assim quando retornar da api ser inserido o nome
    }

  ngOnInit(): void {
    this.loadProduct()
  }

  loadProduct(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('id', id)
    if(id) this.shopService.getProduct(+id).subscribe({
      next: productDetails => {
        this.product = productDetails;
        this.bcService.set('@productDetails', productDetails.name); //coloca o nome vindo da api no header
      },
      error : err => console.log("Erro ao carregar produto por Id")
    });
  }

}
