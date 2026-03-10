module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', 'jsx-a11y'],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
        'no-restricted-imports': ['error', {
            paths: [{
                name: '@monaco-editor/react',
                message: '⛔ Monaco is NOT allowed in this directory! Use simple inputs instead.'
            }, {
                name: 'monaco-editor',
                message: '⛔ Monaco prohibited here - this is a user-facing page!'
            }],
            patterns: [{
                group: ['**/monaco-editor/**'],
                message: '⛔ Monaco editor cannot be used in production payment flows'
            }]
        }]
    },
    overrides: [
        {
            files: ['pages/CheckoutPage.tsx', 'pages/PaymentsPage.tsx', 'components/SettlementManager.tsx', 'components/PaymentsTable.tsx'],
            rules: {
                'no-restricted-imports': ['error', {
                    paths: [
                        {
                            name: '@monaco-editor/react',
                            message: '🚨 PAYMENT PAGE: No Monaco! Use Stripe Elements or simple inputs.'
                        }
                    ]
                }]
            }
        },
        {
            files: ['pages/DeveloperPage.tsx', 'components/TracingGuide.tsx'],
            rules: {
                'no-restricted-imports': 'off' // Allowed in dev tools
            }
        }
    ]
};
