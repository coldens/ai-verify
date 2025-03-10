import type React from 'react';
import { useState } from 'react';
import { Upload, ImageIcon, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ImageAIDetection() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Create form data to send the image
      const formData = new FormData();
      formData.append('file', file);

      // Send the image to the backend
      const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error processing the image');
      }

      const data = await response.json();
      setResult(data.is_ai);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">REAL-IA</CardTitle>
          <CardDescription>
            Sube una imagen para verificar si fue generada por IA o creada por un humano
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div
                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {image ? (
                  <div className="relative w-full">
                    <img
                      src={image || '/placeholder.svg'}
                      alt="Preview"
                      className="mx-auto max-h-[300px] rounded-md object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                      <ImageIcon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mb-2 text-sm font-semibold">Haz clic para subir una imagen</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG o GIF (máx. 10MB)</p>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={!image || loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Analizar Imagen
                </>
              )}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result !== null && !loading && !error && (
            <div className="mt-6">
              <Alert variant={result ? 'destructive' : 'default'} className="border-2">
                <div className="flex items-center gap-2">
                  {result ? (
                    <XCircle className="h-5 w-5 text-destructive" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <AlertTitle>{result ? 'Generado por IA' : 'Creado por Humano'}</AlertTitle>
                </div>
                <AlertDescription className="mt-2">
                  {result
                    ? 'Esta imagen probablemente fue generada por inteligencia artificial.'
                    : 'Esta imagen probablemente fue creada por un humano.'}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground">
          <p>Límite de carga: 10MB por imagen</p>
          <p>Formatos soportados: JPG, PNG, GIF</p>
        </CardFooter>
      </Card>
    </div>
  );
}
