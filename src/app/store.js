import {create} from "zustand"

const useStore = create((set)=>({
    connected:0,
    setConnected:(con)=>set(state=>({connected:con}))
}))

export default useStore