import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  closeDel,
  deleteProduct,
  getAllProduct,
  getCart,
  newQuantity,
  openDel,
  updateCart,
} from "./store/reducers/productReducer";
import Product from "./interface";

export default function App() {
  const [addQuantity, setAddQuantity] = useState<number>(0);
  const [number, setNumber] = useState<number>(0);
  const [subItem, setSubItem] = useState<any>({});
  const [inputValues, setInputValues] = useState<{ [key: number]: number }>({});
  const [cartInputValues, setCartInputValues] = useState<{
    [key: number]: any;
  }>({});
  const [deleteId, setDeleteId] = useState<number>(0);
  const state: any = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProduct());
    dispatch(getCart());
  }, [dispatch]);

  const addToCart = (item: any) => {
    console.log(item.id, "id");

    let quantity = inputValues[item.id];

    let index = state.products.product.findIndex((p: any) => p.id === item.id);

    let subItem = {
      ...state.products.product[index],
      quantity: state.products.product[index].quantity - quantity,
    };

    dispatch(newQuantity(subItem));

    let newItem = { ...item, quantity };
    dispatch(addProduct(newItem));
  };

  const handleChanges =
    (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValues({
        ...inputValues,
        [id]: Number(e.target.value),
      });
    };

  const remove = (id: number) => {
    let index = state.products.product.findIndex((p: any) => p.id === id);
    let indexCart = state.products.cart.findIndex((p: any) => p.id === id);

    setSubItem({
      ...state.products.product[index],
      quantity:
        state.products.product[index].quantity +
        state.products.cart[indexCart].quantity,
    });

    setDeleteId(id);
    dispatch(openDel());
  };

  const onClose = () => {
    dispatch(closeDel());
  };

  const onConfirm = () => {
    let index = state.products.cart.find(
      (item: Product) => item.id === deleteId
    );

    dispatch(deleteProduct(index.id));
    dispatch(newQuantity(subItem));
  };

  const handleCartChanges =
    (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuantity = Number(e.target.value);
      setCartInputValues({
        ...cartInputValues,
        [id]: newQuantity,
      });

      let index = state.products.product.find((p: any) => p.id == id);

      for (var i = 0; i < state.products.product.length; i++) {
        if (state.products.product[i].id == index.id) {
          let id = i;

          setNumber(id);
        }
      }
    };

  useEffect(() => {
    console.log(number, "123123123123");
  }, [number]);

  const update = (item: Product) => {
    const cartQuantity = cartInputValues[item.id];
    let index = state.products.product.findIndex((p: any) => p.id === item.id);
    console.log(index, "0123012301031031031");
    let i = state.products.product.findIndex((p: any) => p.id === index);
    const add = state.products.cart[i].quantity;
    console.log(state.products.cart[i].quantity);

    setSubItem({
      ...state.products.product[index],
      quantity: state.products.product[index].quantity - cartQuantity,
    });

    if (Object.keys(cartInputValues).length !== 0) {
      let newItem = {
        ...item,
        quantity: cartQuantity,
      };
      dispatch(updateCart(newItem));
    }
    const updatedProductQuantity =
      state.products.product[index].quantity - cartQuantity + add;
    const updatedProductItem = {
      ...state.products.product[index],
      quantity: updatedProductQuantity,
    };

    setSubItem(updatedProductItem);
    dispatch(newQuantity(updatedProductItem));
  };

  return (
    <div className="flex justify-evenly">
      <div
        id="list-product"
        className="w-[40%] border-solid border-2 border-violet-700"
      >
        <div>
          <div className="mx-[10px]">
            <h2>List product</h2>
            <div className="flex flex-col">
              {state.products.product.map((item: Product, index: number) => (
                <div
                  key={item.id}
                  className="border-solid border-2 border-rose-600 mb-[30px]"
                >
                  <div className="my-[10px] mx-[10px]">
                    <div className="flex gap-7">
                      <img
                        className="w-[20%] h-auto"
                        src={item.image}
                        alt={item.name}
                      />
                      <div>
                        <b>{item.name}</b>
                        <p>{item.description}</p>
                        <b>Total: {item.quantity}</b>
                      </div>
                      <div>
                        <input
                          className="w-[100px] h-[29px] rounded-lg"
                          type="number"
                          onChange={handleChanges(item.id)}
                          value={inputValues[item.id] || 0}
                          min={0}
                          max={item.quantity}
                        />
                        <br />
                        <p>Price: {item.price} $</p>
                        <button
                          className="text-white bg-sky-300 border-0 w-[100px] h-[30px] rounded-md hover:cursor-pointer"
                          onClick={() => addToCart(item)}
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-[40%] border-solid border-2 border-violet-700 h-auto">
        <div className="mx-5">
          <div>
            <h2>Shopping cart</h2>
            <div>
              {state.products.cart.map((item: Product, index: number) => (
                <div
                  key={item.id}
                  className="border-solid border-2 border-rose-600 mb-[50px]"
                >
                  <div className="my-[10px] mx-[10px]">
                    <div className="flex gap-7">
                      <img
                        className="w-[20%] h-auto"
                        src={item.image}
                        alt={item.name}
                      />
                      <div className="w-[60%] flex flex-col">
                        <b>{item.name}</b>
                        <br />
                        <input
                          type="number"
                          className="w-[100px] h-[30px] rounded-lg"
                          value={cartInputValues[item.id] || item.quantity}
                          onChange={handleCartChanges(item.id)}
                          min={1}
                          max={state.products.product[number].quantity}
                        />
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="flex flex-col gap-5">
                        <b>$ {item.price}</b>
                        <button
                          className="w-[100px] h-[30px] border-solid border-0 border-white hover:cursor-pointer"
                          onClick={() => update(item)}
                        >
                          Update
                        </button>
                        <b
                          className="text-blue-700 hover:underline hover:cursor-pointer"
                          onClick={() => remove(item.id)}
                        >
                          Remove
                        </b>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-solid border-red-400 border-2 mb-[30px]">
              <div>
                <div className="flex justify-center">
                  <div className="flex justify-between w-[80%]">
                    <b>Subtotal</b>
                    <b>$ 262.00</b>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-[80%] h-[70px] bg-green-200 flex justify-center items-center rounded-lg ">
                    Update product successfully
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {state.products.deleteFormStatus ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded">
            <p></p>
            <div className="flex justify-end mt-4">
              <button
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={onConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
