import Header from "@/components/ui/Header"
import { UserProvider } from "../_context/UserContext"
import { SessionProvider } from "next-auth/react"


const DashboardLayout = ({children}:{
    children:React.ReactNode
}) => {
  return (
    <UserProvider>      
      <div className="flex flex-col flex-1">

          <Header/>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
      </div>
    </UserProvider>
  
  )
}

export default DashboardLayout