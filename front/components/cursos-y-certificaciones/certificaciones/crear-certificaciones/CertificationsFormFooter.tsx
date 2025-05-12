import { CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function CertificationsFormFooter({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <CardFooter className="flex justify-between border-t pt-6">
      <Link href="/cursos-y-certificaciones">
        <Button variant="outline" type="button">
          Cancelar
        </Button>
      </Link>
      <Button
        className="bg-primary hover:bg-primary/90"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 1 2a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Guardando...
          </>
        ) : (
          "Guardar Curso"
        )}
      </Button>
    </CardFooter>
  );
}

export default CertificationsFormFooter;
