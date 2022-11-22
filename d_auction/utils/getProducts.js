import {tables} from "../constants"

export default async function getProducts(){
    const products = await fetch(tables["productListTable"])
    return await products.json()
}