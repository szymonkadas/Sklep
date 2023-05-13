function createProduct(
    name:string,
    photo: string,
    cathegory: string,
    rating = '/ratings/1',
    discount=true, 
    discount_price=99.99, 
    home_page_display=true, 
    price = 149.99,
    count = 10, 
    currency="pln", 
    ){
    return { name, photo, cathegory, count, currency, discount, discount_price, home_page_display, price, rating }
}