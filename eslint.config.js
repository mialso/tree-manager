import js from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin'
import json from '@eslint/json';
import { defineConfig } from 'eslint/config';

const jsRules = {
    'no-restricted-exports': ['error', { 'restrictDefaultExports': { 'direct': true, 'named': true } }],
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
    '@stylistic/indent': ['error', 4],
    '@stylistic/comma-dangle': ['error', 'always-multiline'],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/multiline-comment-style': ['error', 'starred-block'],
}

const jsPlugins = { js, '@stylistic': stylistic }

export default defineConfig([ // eslint-disable-line no-restricted-exports
    { ignores: ['example/**', 'dist/**'] },
    {
        files: ['src/*.js', '*.js'],
        plugins: jsPlugins,
        extends: ['js/recommended'],
        languageOptions: { globals: { ...globals.node } },
        rules: jsRules,
    },
    { files: ['**/*.json'], ignores: ['package-lock.json'], plugins: { json }, language: 'json/json', extends: ['json/recommended'] },
]);
