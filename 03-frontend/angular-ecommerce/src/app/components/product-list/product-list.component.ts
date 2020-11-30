import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] =[];
  currentCategoryId: number =1;
  thePreviousCategoryId: number=1;
  currentCategoryName: String ='Books';
  searchMode: boolean =false;

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalNumber: number = 0;

  previousKeyword: string= null;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( () =>{
      this.listProducts();
    });
  }
  
  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
     this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
    
  }

  handleListProducts(){

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    }
    else{
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books'
      
    }
    

    if(this.thePreviousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;

    }
    this.thePreviousCategoryId=this.currentCategoryId;  
    console.log('currentCategory= '+this.currentCategoryId+' pageNumber= '+this.thePageNumber);


    this.productService.getProductListPaginate(this.thePageNumber-1,
                                               this.thePageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }
  
  processResult(){
      return data => {
        this.products = data._embedded.products;
        this.thePageNumber= data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalNumber = data.page.totalElements;
      }
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    if(this.previousKeyword!=theKeyword){
      this.thePageNumber=1;
    }
    this.previousKeyword=theKeyword;
    console.log('keyword= '+theKeyword+' thePageNumber= '+this.thePageNumber);

    this.productService.searchProductsPaginate(this.thePageNumber-1,
                                              this.thePageSize,
                                              theKeyword ).subscribe(this.processResult());
  }

  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber= 1;
    this.listProducts();
  }

  addToCart(theProduct: Product){
    console.log('adding to cart: '+theProduct.name+', '+theProduct.unitPrice);
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);

  }
}
