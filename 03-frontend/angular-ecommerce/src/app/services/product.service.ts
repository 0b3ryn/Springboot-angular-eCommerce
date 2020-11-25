import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  
  private baseUrl = "http://localhost:8080/api/products";
  private categoryUrl = "http://localhost:8080/api/product-category";

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]>{
    const searchUrl = this.baseUrl+'/search/findByCategoryId?id='+theCategoryId;
    

    return this.getProducts(searchUrl);

  }


  getProductCategories(): Observable<ProductCategory[]>{

    return this.httpClient.get<GetResponseProductategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
  );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = this.baseUrl+'/search/findByNameContaining?name='+theKeyword;
    

    return this.getProducts(searchUrl);
    
  }



  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = this.baseUrl+'/'+theProductId;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number,
                         thePageSize:number,
                         theCategoryId: number): Observable<GetResponseProducts>{

    const searchUrl = this.baseUrl+'/search/findByCategoryId?id='+theCategoryId+'&page='+thePage+'&size='+thePageSize;
    

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  searchProductsPaginate(thePage: number,
                        thePageSize:number,
                        theKeyword: string): Observable<GetResponseProducts>{

const searchUrl = this.baseUrl+'/search/findByNameContaining?name='+theKeyword+'&page='+thePage+'&size='+thePageSize;


return this.httpClient.get<GetResponseProducts>(searchUrl);

}

}

interface GetResponseProducts{
  _embedded:{
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductategory{
  _embedded:{
    productCategory: ProductCategory[];
  }
}
