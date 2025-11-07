export const useConstructUrl = (key: string)=>{
    return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/v1762514712/${key}`
}
//https://res.cloudinary.com/dlouto1m6/image/upload/v1762514712/uploads/gbwq6axua3g6jmnjfne5.png