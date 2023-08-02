import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, BasketItem, BasketTotals } from '../shared/models/basket';
import { HttpClient } from '@angular/common/http';
import { Product } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<Basket | null>(null);
  basketSource$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<BasketTotals | null>(null);
  basketTotalsSource$ = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) { }

  getBasket(id: string) {
    return this.http.get<Basket>(this.baseUrl + 'basket?id=' + id).subscribe({
      next: basket =>{
        this.basketSource.next(basket);
        this.calculateTotals();
      }

    })
  }

  setBasket(basket : Basket) {
    return this.http.post<Basket>(this.baseUrl + 'basket', basket).subscribe({
      next: basket => {
        this.basketSource.next(basket);
        this.calculateTotals();
      }

    })

  }

  getCurrentBasketValue(){
    console.log('BasketSource: ',this.basketSource.value);
    console.log('BasketSource$: ', this.basketSource$);

    return this.basketSource.value;

  }

  addItemToBasket(item: Product | BasketItem, quantity = 1) {
    if(this.isProduct(item)) item = this.mapProductItemToBasketItem(item);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, item, quantity);
    this.setBasket(basket)
  }

  removeItemFromBasket(id: number, quantity = 1) {
    const basket = this.getCurrentBasketValue();
    if(!basket) return;
    const item = basket.items.find(x => x.id === id);
    if(item){
      item.quantity -= quantity;
      if(item.quantity === 0){
        basket.items = basket.items.filter(x => x.id !== id); //removee o item caso a quantidade for zero
      }
      if(basket.items.length > 0) this.setBasket(basket);
      else this.deleteBasket(basket)
    }
  }
  deleteBasket(basket: Basket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe({
      next: () => {
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket_id');
      }
    })
  }

  private addOrUpdateItem(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[] {
    const item = items.find(x => x.id === itemToAdd.id);
    if(item) item.quantity += quantity; //se já tiver item do tipo BasketItem , ele aumenta
    else {
      itemToAdd.quantity = quantity; //insere na quantidade a quantity passada por parâmetro
      items.push(itemToAdd); //insere no array items o item
    }
    return items;
  }

  private createBasket(): Basket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(item: Product) : BasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType
    }
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    console.log('basket', basket);
    if(!basket) return;
    const shipping = 0;
    const subtotal = basket.items.reduce((acc, i) => (i.price * i.quantity) + acc, 0);
    const total = subtotal + shipping;

    this.basketTotalSource.next({shipping, subtotal, total});
    console.log('TotalSource',this.basketTotalSource)
  }

  private isProduct(item:Product | BasketItem): item is Product {
    return (item as Product).productBrand !== undefined;
  }
 }
