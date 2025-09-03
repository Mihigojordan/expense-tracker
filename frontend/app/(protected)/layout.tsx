import { ProtectedRoute } from "@/components/ProtectedRoute";

const ProtectedLayout = ({children}:Readonly<{
  children: React.ReactNode;
}>
) => {
  return (
<ProtectedRoute>
    {children}
</ProtectedRoute>
  )
}

export default ProtectedLayout