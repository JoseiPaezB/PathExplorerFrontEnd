"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    User, Briefcase, GraduationCap, Award, Lightbulb,
    ArrowLeft, Save, Loader2, Trash2, Plus, X
} from "lucide-react";

interface CVDataPreviewProps {
    data: any;
    onSave: (editedData: any) => void;
    onBack: () => void;
    isLoading: boolean;
}

export default function CVDataPreview({ data, onSave, onBack, isLoading }: CVDataPreviewProps) {
    const [editableData, setEditableData] = useState(data);

    const updatePersonalInfo = (field: string, value: string) => {
        setEditableData((prev: any) => ({
            ...prev,
            informacion_personal: { ...prev.informacion_personal, [field]: value }
        }));
    };

    const updateExperience = (index: number, field: string, value: string) => {
        setEditableData((prev: any) => ({
            ...prev,
            experiencia_laboral: prev.experiencia_laboral?.map((exp: any, i: number) =>
                i === index ? { ...exp, [field]: value } : exp
            ) || []
        }));
    };

    const removeExperience = (index: number) => {
        setEditableData((prev: any) => ({
            ...prev,
            experiencia_laboral: prev.experiencia_laboral?.filter((_: any, i: number) => i !== index) || []
        }));
    };

    const updateEducation = (index: number, field: string, value: string) => {
        setEditableData((prev: any) => ({
            ...prev,
            educacion: prev.educacion?.map((edu: any, i: number) =>
                i === index ? { ...edu, [field]: value } : edu
            ) || []
        }));
    };

    const removeEducation = (index: number) => {
        setEditableData((prev: any) => ({
            ...prev,
            educacion: prev.educacion?.filter((_: any, i: number) => i !== index) || []
        }));
    };

    const updateSkill = (category: 'tecnicas' | 'blandas', index: number, value: string) => {
        setEditableData((prev: any) => ({
            ...prev,
            habilidades: {
                ...prev.habilidades,
                [category]: prev.habilidades?.[category]?.map((skill: string, i: number) =>
                    i === index ? value : skill
                ) || []
            }
        }));
    };

    const removeSkill = (category: 'tecnicas' | 'blandas', index: number) => {
        setEditableData((prev: any) => ({
            ...prev,
            habilidades: {
                ...prev.habilidades,
                [category]: prev.habilidades?.[category]?.filter((_: string, i: number) => i !== index) || []
            }
        }));
    };

    const addSkill = (category: 'tecnicas' | 'blandas') => {
        setEditableData((prev: any) => ({
            ...prev,
            habilidades: {
                ...prev.habilidades,
                [category]: [...(prev.habilidades?.[category] || []), ""]
            }
        }));
    };

    const updateCertification = (index: number, field: string, value: string) => {
        setEditableData((prev: any) => ({
            ...prev,
            certificaciones: prev.certificaciones?.map((cert: any, i: number) =>
                i === index ? { ...cert, [field]: value } : cert
            ) || []
        }));
    };

    const removeCertification = (index: number) => {
        setEditableData((prev: any) => ({
            ...prev,
            certificaciones: prev.certificaciones?.filter((_: any, i: number) => i !== index) || []
        }));
    };

    const InfoCard = ({ icon: Icon, title, children }: any) => (
        <Card className="border-purple-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="flex items-center gap-2 text-lg text-purple-800">
                    <Icon className="h-5 w-5 text-purple-600" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">{children}</CardContent>
        </Card>
    );

    return (
        <div className="flex flex-col h-full">
            {/* Header fijo */}
            <div className="shrink-0 border-b bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={onBack} disabled={isLoading}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                        <div>
                            <h3 className="text-xl font-semibold text-purple-800">Vista Previa y Edición</h3>
                            <p className="text-sm text-purple-600">Edita la información antes de guardar</p>
                        </div>
                    </div>

                    <Button onClick={() => onSave(editableData)} disabled={isLoading} size="lg" className="bg-green-600 hover:bg-green-700">
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Guardar en mi Perfil
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Contenido con scroll */}
            <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <div className="p-6">
                        <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="grid w-full grid-cols-5 mb-6">
                                <TabsTrigger value="personal">Personal</TabsTrigger>
                                <TabsTrigger value="experience">Experiencia</TabsTrigger>
                                <TabsTrigger value="education">Educación</TabsTrigger>
                                <TabsTrigger value="skills">Habilidades</TabsTrigger>
                                <TabsTrigger value="certifications">Certificaciones</TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal" className="space-y-6">
                                <InfoCard icon={User} title="Información Personal">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Nombre Completo</Label>
                                            <Input
                                                value={editableData.informacion_personal?.nombre_completo || ''}
                                                onChange={(e) => updatePersonalInfo('nombre_completo', e.target.value)}
                                                placeholder="Tu nombre completo"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label>Email</Label>
                                            <Input
                                                value={editableData.informacion_personal?.email || ''}
                                                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                                                placeholder="tu@email.com"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label>Teléfono</Label>
                                            <Input
                                                value={editableData.informacion_personal?.telefono || ''}
                                                onChange={(e) => updatePersonalInfo('telefono', e.target.value)}
                                                placeholder="+52 81 1234 5678"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label>Ubicación</Label>
                                            <Input
                                                value={editableData.informacion_personal?.direccion || ''}
                                                onChange={(e) => updatePersonalInfo('direccion', e.target.value)}
                                                placeholder="Ciudad, País"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label>LinkedIn</Label>
                                            <Input
                                                value={editableData.informacion_personal?.linkedin || ''}
                                                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                                                placeholder="https://linkedin.com/in/usuario"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label>GitHub</Label>
                                            <Input
                                                value={editableData.informacion_personal?.github || ''}
                                                onChange={(e) => updatePersonalInfo('github', e.target.value)}
                                                placeholder="https://github.com/usuario"
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </InfoCard>
                            </TabsContent>

                            <TabsContent value="experience" className="space-y-6">
                                <InfoCard icon={Briefcase} title={`Experiencia Laboral (${editableData.experiencia_laboral?.length || 0})`}>
                                    {editableData.experiencia_laboral?.length > 0 ? (
                                        <div className="space-y-6">
                                            {editableData.experiencia_laboral.map((exp: any, index: number) => (
                                                <div key={index} className="border rounded-lg p-4 relative">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeExperience(index)}
                                                        className="absolute top-2 right-2 h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                                                        <div>
                                                            <Label>Cargo</Label>
                                                            <Input
                                                                value={exp.cargo || ''}
                                                                onChange={(e) => updateExperience(index, 'cargo', e.target.value)}
                                                                className="mt-1"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Empresa</Label>
                                                            <Input
                                                                value={exp.empresa || ''}
                                                                onChange={(e) => updateExperience(index, 'empresa', e.target.value)}
                                                                className="mt-1"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Fecha Inicio</Label>
                                                            <Input
                                                                value={exp.fecha_inicio || ''}
                                                                onChange={(e) => updateExperience(index, 'fecha_inicio', e.target.value)}
                                                                className="mt-1"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Fecha Fin</Label>
                                                            <Input
                                                                value={exp.fecha_fin || ''}
                                                                onChange={(e) => updateExperience(index, 'fecha_fin', e.target.value)}
                                                                className="mt-1"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">No se encontró experiencia laboral</p>
                                    )}
                                </InfoCard>
                            </TabsContent>

                            <TabsContent value="education" className="space-y-6">
                                <InfoCard icon={GraduationCap} title={`Educación (${editableData.educacion?.length || 0})`}>
                                    {editableData.educacion?.length > 0 ? (
                                        <div className="space-y-4">
                                            {editableData.educacion.map((edu: any, index: number) => (
                                                <div key={index} className="border rounded-lg p-4 relative">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeEducation(index)}
                                                        className="absolute top-2 right-2 h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                                                        <div>
                                                            <Label>Título/Grado</Label>
                                                            <Input
                                                                value={edu.titulo || ''}
                                                                onChange={(e) => updateEducation(index, 'titulo', e.target.value)}
                                                                className="mt-1"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Institución</Label>
                                                            <Input
                                                                value={edu.institucion || ''}
                                                                onChange={(e) => updateEducation(index, 'institucion', e.target.value)}
                                                                className="mt-1"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">No se encontró información educativa</p>
                                    )}
                                </InfoCard>
                            </TabsContent>

                            <TabsContent value="skills" className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <InfoCard icon={Lightbulb} title={`Habilidades Técnicas (${editableData.habilidades?.tecnicas?.length || 0})`}>
                                        <div className="space-y-3">
                                            <Button onClick={() => addSkill('tecnicas')} size="sm" className="w-full">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Agregar
                                            </Button>
                                            {editableData.habilidades?.tecnicas?.length > 0 ? (
                                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                                    {editableData.habilidades.tecnicas.map((skill: string, index: number) => (
                                                        <div key={index} className="flex gap-2">
                                                            <Input
                                                                value={skill}
                                                                onChange={(e) => updateSkill('tecnicas', index, e.target.value)}
                                                                className="flex-1"
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => removeSkill('tecnicas', index)}
                                                                className="h-10 w-10 p-0"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-center py-4">No se encontraron habilidades técnicas</p>
                                            )}
                                        </div>
                                    </InfoCard>

                                    <InfoCard icon={Lightbulb} title={`Habilidades Blandas (${editableData.habilidades?.blandas?.length || 0})`}>
                                        <div className="space-y-3">
                                            <Button onClick={() => addSkill('blandas')} size="sm" className="w-full">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Agregar
                                            </Button>
                                            {editableData.habilidades?.blandas?.length > 0 ? (
                                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                                    {editableData.habilidades.blandas.map((skill: string, index: number) => (
                                                        <div key={index} className="flex gap-2">
                                                            <Input
                                                                value={skill}
                                                                onChange={(e) => updateSkill('blandas', index, e.target.value)}
                                                                className="flex-1"
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => removeSkill('blandas', index)}
                                                                className="h-10 w-10 p-0"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-center py-4">No se encontraron habilidades blandas</p>
                                            )}
                                        </div>
                                    </InfoCard>
                                </div>
                            </TabsContent>

                            <TabsContent value="certifications" className="space-y-6">
                                <InfoCard icon={Award} title={`Certificaciones (${editableData.certificaciones?.length || 0})`}>
                                    {editableData.certificaciones?.length > 0 ? (
                                        <div className="space-y-4">
                                            {editableData.certificaciones.map((cert: any, index: number) => (
                                                <div key={index} className="border rounded-lg p-4 relative">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeCertification(index)}
                                                        className="absolute top-2 right-2 h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                                                        <div>
                                                            <Label>Nombre</Label>
                                                            <Input
                                                                value={cert.nombre || ''}
                                                                onChange={(e) => updateCertification(index, 'nombre', e.target.value)}
                                                                className="mt-1"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Emisor</Label>
                                                            <Input
                                                                value={cert.emisor || ''}
                                                                onChange={(e) => updateCertification(index, 'emisor', e.target.value)}
                                                                className="mt-1"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">No se encontraron certificaciones</p>
                                    )}
                                </InfoCard>
                            </TabsContent>
                        </Tabs>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}