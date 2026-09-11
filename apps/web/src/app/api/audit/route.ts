import { NextRequest, NextResponse } from 'next/server';
import { StaticScanner } from '@foldlens/analyzer';
import { FoldLensReport } from '@foldlens/core-types';
import {
  extractFromUploadedFiles,
  extractFromSwiftCode,
  extractFromLocalPath
} from '../../../utils/metadataExtractor';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const scanner = new StaticScanner();
    let report: FoldLensReport;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      let appName = (formData.get('appName') as string) || '';
      let bundleId = (formData.get('bundleId') as string) || '';
      const rawCode = formData.get('rawCode') as string | null;

      const fileEntries = formData.getAll('files') as File[];
      const singleFile = formData.get('file') as File | null;
      const allFiles = [...fileEntries, ...(singleFile ? [singleFile] : [])];

      if (rawCode) {
        const meta = extractFromSwiftCode(rawCode);
        appName = appName || meta.appName;
        bundleId = bundleId || meta.bundleId;

        report = await scanner.scan({
          rawCode,
          appName: appName || 'AuditedApp',
          bundleId: bundleId || 'com.example.app'
        });
      } else if (allFiles.length > 0) {
        const inMemoryFiles: Array<{ name: string; content: string }> = [];

        for (const file of allFiles) {
          const text = await file.text();
          inMemoryFiles.push({
            name: file.name,
            content: text
          });
        }

        const meta = extractFromUploadedFiles(inMemoryFiles);
        appName = appName || meta.appName;
        bundleId = bundleId || meta.bundleId;

        report = await scanner.scan({
          files: inMemoryFiles,
          appName: appName || 'AuditedApp',
          bundleId: bundleId || 'com.example.app'
        });
      } else {
        report = await scanner.scan({
          targetPath: '.',
          appName: appName || 'AuditedApp',
          bundleId: bundleId || 'com.example.app'
        });
      }
    } else {
      const body = await request.json();
      let {
        targetPath,
        files,
        rawCode,
        appName,
        bundleId
      } = body;

      if (rawCode) {
        const meta = extractFromSwiftCode(rawCode);
        appName = appName || meta.appName;
        bundleId = bundleId || meta.bundleId;

        report = await scanner.scan({
          rawCode,
          appName: appName || 'AuditedApp',
          bundleId: bundleId || 'com.example.app'
        });
      } else if (files && Array.isArray(files) && files.length > 0) {
        const meta = extractFromUploadedFiles(files);
        appName = appName || meta.appName;
        bundleId = bundleId || meta.bundleId;

        report = await scanner.scan({
          files,
          appName: appName || 'AuditedApp',
          bundleId: bundleId || 'com.example.app'
        });
      } else {
        const meta = extractFromLocalPath(targetPath || '.');
        appName = appName || meta.appName;
        bundleId = bundleId || meta.bundleId;

        report = await scanner.scan({
          targetPath: targetPath || '.',
          appName: appName || 'AuditedApp',
          bundleId: bundleId || 'com.example.app'
        });
      }
    }

    return NextResponse.json({
      success: true,
      report
    });
  } catch (error: any) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to execute static analysis'
      },
      { status: 500 }
    );
  }
}
