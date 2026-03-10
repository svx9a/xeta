import fs from 'fs';
import path from 'path';

const FORBIDDEN_PATHS = [
    'pages/CheckoutPage.tsx',
    'pages/PaymentsPage.tsx',
    'components/PaymentsTable.tsx',
    'components/SettlementManager.tsx'
];

const FORBIDDEN_IMPORTS = [
    '@monaco-editor/react',
    'monaco-editor',
    'react-monaco-editor'
];

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, '/', file));
        }
    });

    return arrayOfFiles;
}

function checkMonacoUsage() {
    // Use current directory assuming it's run from project root
    const files = getAllFiles('./src/pages').concat(getAllFiles('./src/components'));
    const violations = [];

    files.forEach(file => {
        // Skip if not in forbidden paths
        if (!FORBIDDEN_PATHS.some(p => file.replace(/\\/g, '/').includes(p))) {
            return;
        }

        const content = fs.readFileSync(file, 'utf-8');

        FORBIDDEN_IMPORTS.forEach(imp => {
            if (content.includes(`from '${imp}'`) || content.includes(`require('${imp}')`)) {
                violations.push({
                    file,
                    import: imp,
                    reason: `${file} is in a restricted directory (${FORBIDDEN_PATHS.find(p => file.includes(p))})`
                });
            }
        });
    });

    if (violations.length > 0) {
        console.error('🚨 MONACO USAGE DETECTED IN RESTRICTED AREAS!');
        console.table(violations);
        process.exit(1);
    } else {
        console.log('✅ No Monaco editor usage in restricted areas.');
    }
}

// Run in CI/CD pipeline
checkMonacoUsage();
