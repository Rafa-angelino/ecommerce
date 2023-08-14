import { Component, OnInit } from '@angular/core';
import { ShopService } from '../shop.service';
import { Product } from 'src/app/shared/models/product';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;
  quantity = 1;
  quantityInBasket = 0;

  constructor(private shopService: ShopService, private activatedRoute: ActivatedRoute,
    private bcService: BreadcrumbService, private basketService: BasketService){
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
        this.basketService.basketSource$.pipe(take(1)).subscribe({
          next: basket => {
            const item = basket?.items.find(x  => x.id === +id);
            if(item){
              this.quantity = item.quantity;
              this.quantityInBasket = item.quantity;
            }
          }
        })
      },
      error : err => console.log("Erro ao carregar produto por Id")
    });
  }

  incrementQuantity(){
    this.quantity++;
  }

  decrementQuantity(){
    this.quantity--;
  }

  updateBasket(){
    if(this.product){
      if(this.quantity > this.quantityInBasket){ //caso inserir uma quantidade do item maior da que está no carrinho
        const itemsToAdd = this.quantity - this.quantityInBasket; //descobrir a quantidade de itens para adicionar
        this.quantityInBasket += itemsToAdd; //aumenta a quantidade de itens no carrinho
        this.basketService.addItemToBasket(this.product,itemsToAdd)
      } else {
        const itemsToRemove = this.quantityInBasket - this.quantity;
        this.quantityInBasket -= itemsToRemove;
        this.basketService.removeItemFromBasket(this.product.id,itemsToRemove)
      }
    }
  }

  get buttonText() {
    return this.quantityInBasket === 0 ? 'Adicionar ao carrinho' : 'Atualizar carrinho';
  }

}
