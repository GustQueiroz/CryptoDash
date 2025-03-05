export function ProfileSettings() {
  return (
    <div className="p-6 rounded-xl bg-[#0F1215] border border-gray-800 shadow-lg">
      <h2 className="text-lg font-medium text-white mb-6">Configurações</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">
            Notificações
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-white">Alertas de preço</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                defaultChecked
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-white">Notificações por email</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                defaultChecked
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-white">Resumo semanal</span>
              <input type="checkbox" className="toggle toggle-primary" />
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">
            Preferências
          </h3>
          <div className="space-y-3">
            <select className="w-full px-4 py-2 text-sm bg-[#1A1D1F] text-white border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500">
              <option value="BRL">BRL (R$)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
            <select className="w-full px-4 py-2 text-sm bg-[#1A1D1F] text-white border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500">
              <option value="pt-BR">Português (BR)</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
