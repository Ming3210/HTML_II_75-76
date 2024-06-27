import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import Product from "../../interface"
import axios from "axios";

const initialState:Product[] = []

export const getAllProduct:any = createAsyncThunk("product/getAllProduct",async() =>{
    const response = await axios.get("http://localhost:8080/products");
    
    return response.data;
})
export const getCart:any = createAsyncThunk("cart/getCart",async() =>{
    const response = await axios.get("http://localhost:8080/cart");
    
    return response.data;
})

export const deleteProduct:any = createAsyncThunk("product/deleteProduct",async(id) =>{
    const response = await axios.delete(`http://localhost:8080/cart/${id}`);
    return {id};
})

export const addProduct:any = createAsyncThunk("product/addProduct", async (product: Product) => {
    const response = await axios.post("http://localhost:8080/cart", product);
    return response.data;
  });

export const closeDel:any  = createAsyncThunk("product/closeDel", async()=>{
    return null
})

export const openDel:any  = createAsyncThunk("product/openDel", async()=>{
    return null
})
export const updateProductQuantity:any = createAsyncThunk("product/updateProductQuantity",async(product:any) =>{
    const response = await axios.put(`http://localhost:8080/cart/${product.id}`, product);
    return response.data;
})

export const newQuantity:any = createAsyncThunk("product/newQuantity",async(item:any) =>{
 
    const response = await axios.put(`http://localhost:8080/products/${item.id}`, item);
    return response.data;
})

export const updateCart:any = createAsyncThunk("product/updateCart",async(product:any) =>{
    console.log(product);
    const response = await axios.put(`http://localhost:8080/cart/${product.id}`, product);
    console.log(response.data);
    
    
    return response.data;
})
const productReducer = createSlice({
    name: "products",
    initialState: {
        product:initialState,
        cart:[],
        deleteFormStatus: false
    },
    reducers: {
        
    },
    extraReducers(builder) {
        builder
        .addCase(getAllProduct.pending, (state: any, action: any) => {
            // trạng thái chờ lấy dữ liệu
        })
        .addCase(getAllProduct.fulfilled, (state: any, action: any) => {
            state.product = action.payload
        })
        
        .addCase(getAllProduct.rejected, (state: any, action: any) => {
            // trạng thái chờ lấy dữ liệu
        })
        .addCase(getCart.fulfilled, (state: any, action: any) => {
            state.cart = action.payload
        })
        .addCase(addProduct.fulfilled, (state:any, action:any) => {
            
              state.cart.push(action.payload);
            }
        ).addCase(addProduct.rejected, (state: any, action: any) =>{
            alert("Sp da co trong gio hang")
        })
        .addCase(deleteProduct.fulfilled, (state: any, action: any) =>{
            state.cart = state.cart.filter((item:any) => item.id!== action.payload.id)
            state.deleteFormStatus = false
        })
        .addCase(openDel.fulfilled, (state: any, action: any) =>{
            state.deleteFormStatus = true
        })
        .addCase(closeDel.fulfilled, (state: any, action: any) =>{
            state.deleteFormStatus = false
        }).addCase(newQuantity.fulfilled, (state:any,action: any) =>{
            
            const index = state.product.findIndex((item:any)=>item.id == action.payload.id)            
            state.product[index] = action.payload;
        }).addCase(updateCart.fulfilled, (state: any, action: any) =>{
            const index = state.cart.findIndex((item:any)=>item.id == action.payload.id)
            ;
            state.cart[index] = action.payload;

        })
    },
})

export default productReducer.reducer;