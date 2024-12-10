import { LogOut } from "lucide-react"

import { Authenticator } from "@aws-amplify/ui-react"

function LogoutButton() {
  return (
    <Authenticator>
        {({ signOut }) => (
            <button className="flex items-center space-x-4" onClick={signOut}>
                <LogOut />
                <span>Logout</span>
            </button>
        )}
    </Authenticator>
  )
}

export default LogoutButton