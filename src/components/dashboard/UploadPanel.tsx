import { useCallback, useRef, useState } from "react";
import { Upload, ImageIcon, X, Sparkles, FileImage, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onDigitize: (file: File) => void;
  isProcessing: boolean;
  isDone: boolean;
}

export function UploadPanel({ onDigitize, isProcessing, isDone }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setSelectedFile(file);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setPreview(null);
    setFileName("");
    setSelectedFile(null);

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDigitizeClick= async (file: File) => {
    if (!selectedFile) {
      alert("Please upload an image first");
      return;
    } 

    onDigitize(selectedFile);
  };

  return (
    <section className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-primary/10 grid place-items-center">
              <Upload className="h-3.5 w-3.5 text-primary" />
            </span>
            Upload note
          </h2>
          <p className="text-xs text-muted-foreground mt-1 ml-9">PNG, JPG, or PDF · up to 20 MB</p>
        </div>

        {preview && (
          <button
            onClick={clearFile}
            className="text-xs text-muted-foreground hover:text-destructive transition-smooth flex items-center gap-1"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      {!preview ? (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "relative flex-1 min-h-[280px] rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-smooth flex flex-col items-center justify-center text-center p-6 group",
            dragOver
              ? "border-primary bg-primary/5 scale-[1.01] shadow-glow"
              : "border-border bg-gradient-to-br from-surface to-muted/40 hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-primary/15 blur-3xl animate-blob" />
          <div
            className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-accent/15 blur-3xl animate-blob"
            style={{ animationDelay: "3s" }}
          />

          <div
            className={cn(
              "relative h-16 w-16 rounded-2xl gradient-primary grid place-items-center shadow-glow transition-bounce",
              dragOver && "scale-110 rotate-3"
            )}
          >
            <FileImage className="h-7 w-7 text-primary-foreground" />
          </div>

          <p className="mt-5 font-semibold text-sm">
            {dragOver ? "Drop it here ✨" : "Drag & drop your handwritten note"}
          </p>

          <p className="text-xs text-muted-foreground mt-1.5">
            or <span className="text-primary font-medium underline-offset-2 group-hover:underline">browse files</span>
          </p>

          <div className="mt-6 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="px-2 py-1 rounded-md bg-muted/70 font-medium">JPG</span>
            <span className="px-2 py-1 rounded-md bg-muted/70 font-medium">PNG</span>
            <span className="px-2 py-1 rounded-md bg-muted/70 font-medium">JPEG</span>
          </div>
        </label>
      ) : (
        <div className="flex-1 flex flex-col gap-4 animate-scale-in min-h-0">
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-soft bg-surface flex-1 min-h-0">
            <img
              src={preview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-contain bg-muted/30"
            />

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="glass px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5">
                <ImageIcon className="h-3 w-3" /> {fileName}
              </span>

              {isDone && (
                <span className="glass px-2.5 py-1 rounded-md text-[11px] font-semibold text-success flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" /> Digitized
                </span>
              )}
            </div>
          </div>

          <button
            disabled={isProcessing}
            onClick={handleDigitizeClick}
            className={cn(
              "relative h-12 w-full rounded-xl gradient-primary text-primary-foreground font-semibold text-sm shadow-glow overflow-hidden",
              "transition-bounce hover:scale-[1.02] active:scale-[0.98]",
              "disabled:opacity-90 disabled:cursor-wait disabled:hover:scale-100",
              "before:absolute before:inset-0 before:bg-white/0 hover:before:bg-white/10 before:transition-smooth"
            )}
          >
            <span className="relative flex items-center justify-center gap-2">
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Digitizing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Digitize with AI
                </>
              )}
            </span>
          </button>
        </div>
      )}
    </section>
  );
}