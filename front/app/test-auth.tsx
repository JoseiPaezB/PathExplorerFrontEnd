"use client";

// Create this file at pages/test-auth.tsx or app/test-auth/page.tsx

import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { routePermissions } from "@/components/withRouteProtection";

export default function TestAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  
  // Check if user would be authorized for current path
  const userRole = user?.role || "empleado";
  const currentPathPermissions = pathname ? routePermissions[pathname] : null;
  const isAuthorizedForCurrentPath = currentPathPermissions?.includes(userRole);
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Debugging</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-bold">Authentication Status:</h2>
          <p>Is Loading: {isLoading ? "Yes" : "No"}</p>
          <p>Is Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
        </div>
        
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-bold">User Information:</h2>
          {user ? (
            <>
              <p>Name: {user.nombre} {user.apellido}</p>
              <p>Role: {user.role}</p>
              <p>Email: {user.email}</p>
            </>
          ) : (
            <p>No user data available</p>
          )}
        </div>
        
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-bold">Route Information:</h2>
          <p>Current Path: {pathname}</p>
          <p>Required Roles: {currentPathPermissions ? currentPathPermissions.join(", ") : "Unknown path"}</p>
          <p>Authorized for this path: {isAuthorizedForCurrentPath ? "Yes" : "No"}</p>
        </div>
        
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-bold">All Route Permissions:</h2>
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Path</th>
                  <th className="px-4 py-2 border">Allowed Roles</th>
                  <th className="px-4 py-2 border">Can Access?</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(routePermissions).map(([path, roles]) => (
                  <tr key={path}>
                    <td className="px-4 py-2 border">{path}</td>
                    <td className="px-4 py-2 border">{roles.join(", ")}</td>
                    <td className="px-4 py-2 border">
                      {user && roles.includes(user.role) ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}