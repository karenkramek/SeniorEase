const { spawnSync } = require('child_process');

function isGitleaksInstalled() {
  const result = spawnSync('gitleaks', ['version'], {
    stdio: 'ignore',
    shell: true,
  });

  return result.status === 0;
}

function printInstallHelp() {
  console.log('\n[security] Gitleaks nao encontrado no sistema.');
  console.log('[security] O commit sera bloqueado ate instalar o Gitleaks.');
  console.log('\nInstalacao recomendada por sistema:');
  console.log('- macOS: brew install gitleaks');
  console.log('- Windows (PowerShell): winget install gitleaks');
  console.log('- Windows (Chocolatey): choco install gitleaks');
  console.log('\nDepois valide com: npm run check:gitleaks\n');
}

if (isGitleaksInstalled()) {
  console.log('[security] Gitleaks encontrado. Ambiente pronto para pre-commit.');
} else {
  printInstallHelp();
}
