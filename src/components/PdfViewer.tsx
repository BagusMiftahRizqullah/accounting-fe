"use client";
import React, { useEffect, useRef, useState } from "react";
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
  const viewerRef = useRef<PdfViewerComponent | null>(null);
  const [pageInfo, setPageInfo] = useState<{ current: number; count: number }>({ current: 1, count: 1 });

  useEffect(() => {
    // no-op; component mounts client-side only
  }, []);

  const onDocumentLoaded = (args: { documentPageCount: number }) => {
    setPageInfo((p) => ({ ...p, count: args.documentPageCount }));
  };

  const onPageChanged = (args: { currentPageNumber: number }) => {
    setPageInfo((p) => ({ ...p, current: args.currentPageNumber }));
  };

  const onToolbarClick = (args: { item?: { id?: string } }) => {
    const id = args.item?.id;
    if (!id) return;
    // Example custom actions (extend as needed)
    switch (id) {
      case "customDeleteDocument": {
        // Attempt to unload the current document (mimic Delete)
        const inst: any = viewerRef.current as any;
        if (inst?.unload) inst.unload();
        else if (inst?.destroy) inst.destroy();
        // eslint-disable-next-line no-console
        console.log("Delete document clicked");
        break;
      }
      default:
        break;
    }
  };

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
        ref={(inst) => {
          // store instance for external/custom actions
          viewerRef.current = inst as unknown as PdfViewerComponent;
        }}
        // Toolbar customization to resemble the provided reference
        toolbarSettings={{
          showTooltip: true,
          toolbarItems: [
            // Custom left label: Page X of Y
            {
              id: "pageLabel",
              align: "Left",
              type: "Input",
              // @ts-expect-error: Syncfusion accepts React template nodes for custom items
              template: () => (
                <span className="flex items-center gap-2 text-xs text-gray-700">
                  <span
                    aria-hidden
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    <img src="/file.svg" alt="" className="h-4 w-4" />
                  </span>
                  <span>Page {pageInfo.current} of {pageInfo.count}</span>
                </span>
              ),
            },
            "PageNavigationTool",
            "MagnificationTool",
            "SelectionTool",
            "PanTool",
            "SearchOption",
            "AnnotationEditTool",
            "CommentTool",
            "UndoRedoTool",
            "DownloadOption",
            "PrintOption",
            // Right-side custom action example
            { id: "customDeleteDocument", text: "Delete", align: "Right" },
          ],
        }}
        // @ts-expect-error: annotationToolbarSettings is available in Syncfusion PDF Viewer
        annotationToolbarSettings={{
          // Try to approximate the second row from the screenshot
          // Available items depend on product version; this list is safe to ignore if unsupported
          annotationToolbarItems: [
            "Undo",
            "Redo",
            "Ink",
            "Shape",
            "Stamp",
            "StickyNote",
            "FreeText",
            "HandWrittenSignature",
            "Delete",
          ],
        }}
        toolbarClick={onToolbarClick}
        documentLoad={onDocumentLoaded}
        pageChanged={onPageChanged}
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