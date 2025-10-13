"use client";
import React, { useEffect } from "react";
import {
  PdfViewerComponent,
  Toolbar,
  Magnification,
  Navigation,
  LinkAnnotation,
  BookmarkView,
  ThumbnailView,
  Print,
  TextSelection,
  TextSearch,
  Annotation,
  FormFields,
  FormDesigner,
  PageOrganizer,
  Inject,
} from "@syncfusion/ej2-react-pdfviewer";
import { registerLicense } from "@syncfusion/ej2-base";

// Register Syncfusion license if provided
const licenseKey = process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY;
if (licenseKey) {
  try {
    registerLicense(licenseKey);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Failed to register Syncfusion license:", e);
  }
} else {
  // eslint-disable-next-line no-console
  console.warn(
    "Syncfusion NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY not set. The PDF Viewer will run in trial mode."
  );
}

type PdfViewerProps = {
  documentPath?: string;
  serviceUrl?: string;
  resourceUrl?: string;
  standalone?: boolean; // true: client-side only; false: server-backed
  height?: number | string;
  width?: number | string;
};

export default function PdfViewer({
  documentPath = "https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf",
  serviceUrl = "https://document.syncfusion.com/web-services/pdf-viewer/api/pdfviewer/",
  resourceUrl = "https://cdn.syncfusion.com/ej2/31.1.23/dist/ej2-pdfviewer-lib",
  // Default to server-backed mode to ensure all features (print, download, annotations) are fully routed
  standalone = false,
  height = 600,
  width = "100%",
}: PdfViewerProps) {
  useEffect(() => {
    // no-op; component mounts client-side only
  }, []);

  return (
    <div className="border rounded-lg bg-white">
      <PdfViewerComponent
        id="pdf-viewer"
        // Standalone mode renders purely on the client using resourceUrl assets
        // Server-backed mode uses serviceUrl for processing features
        serviceUrl={standalone ? "" : serviceUrl}
        resourceUrl={standalone ? resourceUrl : undefined}
        // File to view (URL or server document ID)
        documentPath={documentPath}
        style={{ height: typeof height === "number" ? `${height}px` : height, width: typeof width === "number" ? `${width}px` : width }}
      >
        <Inject
          services={[
            Toolbar,
            Magnification,
            Navigation,
            LinkAnnotation,
            BookmarkView,
            ThumbnailView,
            Print,
            TextSelection,
            TextSearch,
            Annotation,
            FormFields,
            FormDesigner,
            PageOrganizer,
          ]}
        />
      </PdfViewerComponent>
    </div>
  );
}