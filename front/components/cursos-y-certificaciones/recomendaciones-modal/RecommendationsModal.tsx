import { fetchGetCoursesAndCertificationsRecommendations } from "@/hooks/fetchGetCoursesAndCertificationsRecommendations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import RecommendationItem from "@/components/cursos-y-certificaciones/recomendaciones-modal/RecommendationItem";
import FilterComponents from "@/components/cursos-y-certificaciones/recomendaciones-modal/FilterComponents";

function RecommendationsModal({ closeModal }: { closeModal: () => void }) {
  const {
    recommendations,
    isLoading,
    getCoursesAndCertificationsRecommendations,
  } = fetchGetCoursesAndCertificationsRecommendations();

  function handleSubmit(
    selectedCourseCategory: string | null,
    selectedCourseInstitution: string | null,
    selectedCourseSkill: string | null,
    selectedCertificationInstitution: string | null,
    selectedCertificationSkill: string | null
  ) {
    getCoursesAndCertificationsRecommendations(
      selectedCourseCategory,
      selectedCourseInstitution,
      selectedCourseSkill,
      selectedCertificationInstitution,
      selectedCertificationSkill);
  }
  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="max-w-4xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>Recomendaciones</DialogTitle>
          <DialogDescription>
            Aquí están tus recomendaciones personalizadas.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          {isLoading ? (
            <div className="flex justify-center items-center w-full h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="text-sm text-gray-500 ml-3">
                Cargando recomendaciones...
              </p>
            </div>
          ) : (
            <>
              <div>
                <h1>Cursos recomendados</h1>
                {recommendations?.recommendations?.cursos_recomendados ? (
                  recommendations?.recommendations?.cursos_recomendados.map(
                    (course, index) => (
                      <RecommendationItem
                        item={course}
                        delay={index * 100}
                        key={course.id}
                      />
                    )
                  )
                ) : (
                  <p>No hay cursos recomendados.</p>
                )}
              </div>
              <div>
                <h1>Certificaciones recomendadas</h1>
                {recommendations?.recommendations
                  ?.certificaciones_recomendadas ? (
                  recommendations?.recommendations?.certificaciones_recomendadas?.map(
                    (cert, index) => (
                      <RecommendationItem
                        item={cert}
                        delay={index * 100}
                        key={cert.id}
                      />
                    )
                  )
                ) : (
                  <p>No hay certificaciones recomendadas.</p>
                )}
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <FilterComponents
            handleSubmit={handleSubmit}
            closeModal={closeModal}
            isLoading={isLoading}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RecommendationsModal;
