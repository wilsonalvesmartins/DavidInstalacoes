import React, { useState, useEffect } from 'react';
import { 
  User, Lock, LogOut, LayoutDashboard, FileText, 
  Settings, Download, Eye, Paperclip, CheckCircle2, 
  Calendar, FilePlus, ChevronRight, UploadCloud,
  Pencil, PlusCircle, X, Trash2
} from 'lucide-react';

const INITIAL_USER = {
  name: "David C da Silva",
  company: "DAVID C DA SILVA INSTALACOES",
  logo: "https://ui-avatars.com/api/?name=DS&background=0D8ABC&color=fff&size=128"
};

// --- COMPONENTES ---

const LoginScreen = ({ onLogin, user }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'administrador' && password === '12345678') {
      onLogin();
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <img src={user.logo} alt="Logo da Empresa" className="w-24 h-24 rounded-full mb-4 shadow-sm" />
          <h1 className="text-2xl font-bold text-slate-800">Portal de Contratos</h1>
          <p className="text-slate-500 text-sm mt-1">{user.company}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input type="text" className="pl-10 w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: administrador" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input type="password" className="pl-10 w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md flex justify-center items-center">
            Acessar Portal
          </button>
        </form>
      </div>
    </div>
  );
};

const ContractDetailView = ({ contract, onBack, onEdit, onDelete, onUpdateContract }) => {
  const [showAddendumForm, setShowAddendumForm] = useState(false);
  const [newAddendum, setNewAddendum] = useState({ title: '', description: '', date: '', file: null });
  const [isUploading, setIsUploading] = useState(false);

  const handleDownload = (fileName) => {
    if(!fileName) return alert("Arquivo não disponível.");
    // Download real acionando a API
    window.open(`/api/download/${fileName}`, '_blank');
  };

  const handleSaveAddendum = async (e) => {
    e.preventDefault();
    if (!newAddendum.file) return alert("Por favor, selecione o arquivo PDF do aditivo.");
    setIsUploading(true);

    const formData = new FormData();
    formData.append('addendumId', `ADT-${Math.floor(Math.random() * 10000)}`);
    formData.append('title', newAddendum.title);
    formData.append('date', newAddendum.date || new Date().toISOString().split('T')[0]);
    formData.append('description', newAddendum.description);
    formData.append('file', newAddendum.file);

    try {
      const response = await fetch(`/api/contratos/${contract.id}/aditivos`, {
        method: 'POST',
        body: formData,
      });
      const savedAddendum = await response.json();
      
      const updatedContract = { ...contract, addendums: [...(contract.addendums || []), savedAddendum] };
      onUpdateContract(updatedContract);
      
      setShowAddendumForm(false);
      setNewAddendum({ title: '', description: '', date: '', file: null });
    } catch (err) {
      alert("Erro ao salvar o aditivo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    if(window.confirm(`Tem certeza que deseja apagar o contrato de ${contract.providerName}? Esta ação não pode ser desfeita.`)) {
      onDelete(contract.id);
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
          <ChevronRight className="h-5 w-5 rotate-180 mr-1" /> Voltar para Meus Contratos
        </button>
        
        <div className="flex space-x-3">
          <button onClick={handleDelete} className="flex items-center text-red-600 hover:text-red-800 bg-white border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Trash2 className="w-4 h-4 mr-2" /> Apagar Contrato
          </button>
          <button onClick={() => onEdit(contract)} className="flex items-center text-slate-600 hover:text-blue-600 bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Pencil className="w-4 h-4 mr-2" /> Editar Dados
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Detalhes do Contrato</h2>
              <p className="text-slate-500 font-mono text-sm mt-1">ID: {contract.id}</p>
            </div>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> {contract.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Prestador / Contratada</p>
              <p className="text-slate-800 font-medium text-lg">{contract.providerName}</p>
              <p className="text-slate-500 text-sm mt-1">CNPJ/CPF: {contract.cnpj}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Objeto do Serviço</p>
              <p className="text-slate-700">{contract.service}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Data de Início</p>
              <p className="text-slate-800 font-medium flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400" /> {contract.startDate?.split('-').reverse().join('/') || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Data de Término</p>
              <p className="text-slate-800 font-medium flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400" /> {contract.endDate ? contract.endDate.split('-').reverse().join('/') : 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Remuneração Base</p>
              <p className="text-slate-800 font-medium">{contract.value || "Não especificado"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
             <h3 className="text-lg font-bold text-slate-800 flex items-center"><Paperclip className="w-5 h-5 mr-2 text-blue-600" /> Documentos Anexados</h3>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Contrato Principal</h4>
              {contract.fileName ? (
                <div className="border border-slate-200 rounded-lg p-4 flex justify-between items-center bg-white hover:border-blue-300 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded mr-4"><FileText className="w-6 h-6" /></div>
                    <div>
                      <h5 className="font-semibold text-slate-800 break-all">{contract.fileName}</h5>
                      <p className="text-xs text-slate-500">Documento original (PDF)</p>
                    </div>
                  </div>
                  <button onClick={() => handleDownload(contract.fileName)} className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2.5 rounded-md transition-colors flex items-center font-medium text-sm">
                    <Download className="w-4 h-4 mr-2" /> Baixar PDF
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">Nenhum ficheiro anexado na criação.</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-3 mt-4">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Aditivos</h4>
                {!showAddendumForm && (
                  <button onClick={() => setShowAddendumForm(true)} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                    <PlusCircle className="w-4 h-4 mr-1" /> Novo Aditivo
                  </button>
                )}
              </div>

              {showAddendumForm && (
                <form onSubmit={handleSaveAddendum} className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-4 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-bold text-blue-800">Adicionar Termo Aditivo</h5>
                    <button type="button" onClick={() => setShowAddendumForm(false)} className="text-blue-400 hover:text-blue-600"><X className="w-5 h-5"/></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Título</label>
                      <input type="text" required value={newAddendum.title} onChange={e => setNewAddendum({...newAddendum, title: e.target.value})} className="w-full rounded border-slate-300 py-2 px-3 text-sm" placeholder="Ex: 2º Termo Aditivo" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Data</label>
                      <input type="date" required value={newAddendum.date} onChange={e => setNewAddendum({...newAddendum, date: e.target.value})} className="w-full rounded border-slate-300 py-2 px-3 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Descrição</label>
                      <input type="text" value={newAddendum.description} onChange={e => setNewAddendum({...newAddendum, description: e.target.value})} className="w-full rounded border-slate-300 py-2 px-3 text-sm" placeholder="Resumo do que foi alterado..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Arquivo PDF</label>
                      <input type="file" accept=".pdf" required onChange={e => setNewAddendum({...newAddendum, file: e.target.files[0]})} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={isUploading} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                      {isUploading ? 'A Enviar...' : 'Salvar Aditivo'}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {(!contract.addendums || contract.addendums.length === 0) && !showAddendumForm && (
                  <p className="text-sm text-slate-500 italic">Nenhum aditivo registrado.</p>
                )}
                {contract.addendums?.map(addendum => (
                  <div key={addendum.id} className="border border-slate-200 rounded-lg p-4 flex justify-between items-center bg-white hover:border-slate-300 transition-colors">
                    <div className="flex items-start">
                      <div className="p-2 bg-slate-100 text-slate-500 rounded mr-4 mt-0.5"><FilePlus className="w-5 h-5" /></div>
                      <div>
                        <h5 className="font-semibold text-slate-800">{addendum.title}</h5>
                        <p className="text-sm text-slate-600 mt-0.5">{addendum.description}</p>
                        <p className="text-xs font-medium text-blue-600 mt-1">Data: {addendum.date?.split('-').reverse().join('/')}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDownload(addendum.fileName)} className="text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 p-2 rounded-md transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContractForm = ({ initialData, onCancel, onSave }) => {
  const [formData, setFormData] = useState(initialData || {
    id: `CTR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    providerName: '', cnpj: '', service: '', startDate: '', endDate: '', value: '', status: 'Ativo'
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!initialData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isEditing) {
      // Editar via JSON (não atualiza arquivo nesta versão simples)
      try {
        const response = await fetch(`/api/contratos/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if(response.ok) onSave(formData, true);
      } catch (err) { alert('Erro ao atualizar contrato'); }
    } else {
      // Criar Novo com Upload
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (file) data.append('file', file);

      try {
        const response = await fetch('/api/contratos', { method: 'POST', body: data });
        const savedContract = await response.json();
        onSave({
          ...savedContract,
          providerName: savedContract.provider_name,
          startDate: savedContract.start_date,
          endDate: savedContract.end_date,
          fileName: savedContract.file_name
        }, false);
      } catch (err) { alert('Erro ao registrar contrato'); }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{isEditing ? 'Editar Contrato' : 'Registrar Novo Contrato'}</h2>
        </div>
        <button onClick={onCancel} className="text-slate-500 border border-slate-200 px-4 py-2 rounded-lg">Cancelar</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Nome do Prestador / Contratada</label>
              <input type="text" value={formData.providerName} onChange={e => setFormData({...formData, providerName: e.target.value})} className="w-full rounded-lg border border-slate-300 py-2 px-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CNPJ / CPF</label>
              <input type="text" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} className="w-full rounded-lg border border-slate-300 py-2 px-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valor (Opcional)</label>
              <input type="text" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className="w-full rounded-lg border border-slate-300 py-2 px-3" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Objeto do Serviço</label>
              <input type="text" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="w-full rounded-lg border border-slate-300 py-2 px-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data de Início</label>
              <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full rounded-lg border border-slate-300 py-2 px-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data de Término</label>
              <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full rounded-lg border border-slate-300 py-2 px-3" />
            </div>
          </div>

          {!isEditing && (
            <div className="border-t pt-6 mt-6">
              <label className="block text-sm font-medium mb-2">Upload do Contrato Principal (PDF)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg relative hover:bg-slate-50">
                <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="text-center">
                  <UploadCloud className={`mx-auto h-12 w-12 ${file ? 'text-blue-500' : 'text-slate-400'}`} />
                  <span className="text-sm font-medium text-blue-600">{file ? file.name : 'Selecione um arquivo PDF'}</span>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg">{isSubmitting ? 'A guardar...' : 'Salvar Contrato'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DashboardApp = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('contracts');
  const [contracts, setContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Busca dados do Backend real ao carregar a página
  useEffect(() => {
    fetch('/api/contratos')
      .then(res => res.json())
      .then(data => {
        setContracts(data);
        setIsLoading(false);
      })
      .catch(err => console.error("Erro ao buscar contratos:", err));
  }, []);

  const selectedContract = contracts.find(c => c.id === selectedContractId);

  const handleSaveContract = (contractData, isEdit) => {
    if (isEdit) {
      setContracts(contracts.map(c => c.id === contractData.id ? { ...c, ...contractData } : c));
      setActiveTab('details');
    } else {
      setContracts([contractData, ...contracts]);
      setActiveTab('contracts');
    }
  };

  const handleDeleteContract = async (id) => {
    try {
      await fetch(`/api/contratos/${id}`, { method: 'DELETE' });
      setContracts(contracts.filter(c => c.id !== id));
      setActiveTab('contracts');
      setSelectedContractId(null);
    } catch (err) {
      alert("Erro ao excluir o contrato");
    }
  };

  const renderContent = () => {
    if (isLoading) return <div className="text-center mt-20 text-slate-500">A carregar informações da Base de Dados...</div>;

    if (activeTab === 'new' || activeTab === 'edit') {
      return <ContractForm initialData={activeTab === 'edit' ? selectedContract : null} onCancel={() => activeTab === 'edit' ? setActiveTab('details') : setActiveTab('contracts')} onSave={handleSaveContract} />;
    }

    if (activeTab === 'details' && selectedContract) {
      return <ContractDetailView contract={selectedContract} onBack={() => {setSelectedContractId(null); setActiveTab('contracts');}} onEdit={() => setActiveTab('edit')} onDelete={handleDeleteContract} onUpdateContract={(updated) => setContracts(contracts.map(c => c.id === updated.id ? updated : c))} />;
    }

    if (activeTab === 'contracts') {
      return (
        <div className="animate-fade-in">
          <div className="mb-8 flex justify-between items-center">
            <div><h2 className="text-2xl font-bold">Meus Contratos</h2></div>
            <button onClick={() => setActiveTab('new')} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex"><FilePlus className="w-5 h-5 mr-2" /> Novo Contrato</button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Prestador</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Serviço</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Vigência</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {contracts.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500">Nenhum contrato registado.</td></tr>
                ) : (
                  contracts.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{item.providerName}</div>
                        <div className="text-sm text-slate-500">{item.id}</div>
                      </td>
                      <td className="px-6 py-4"><div className="text-sm truncate w-48">{item.service}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.startDate?.split('-').reverse().join('/')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button onClick={() => {setSelectedContractId(item.id); setActiveTab('details');}} className="text-blue-600 hover:text-blue-900 font-medium">Visualizar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 border-b border-slate-800 flex flex-col items-center">
          <img src={user.logo} className="w-16 h-16 rounded-lg mb-3 shadow-md bg-white p-1" />
          <h2 className="font-bold text-white text-center text-sm">{user.company}</h2>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          <button onClick={() => {setActiveTab('contracts'); setSelectedContractId(null);}} className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${activeTab !== 'overview' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
            <FileText className="w-5 h-5 mr-3" /> Contratos
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center px-4 py-3 text-sm text-red-400 hover:bg-slate-800 rounded-lg">
            <LogOut className="w-5 h-5 mr-3" /> Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white h-20 border-b px-8 flex items-center justify-between">
          <h1 className="text-xl">Olá, <span className="font-bold">{user.name.split(' ')[0]}</span></h1>
        </header>
        <div className="flex-1 overflow-auto p-8">{renderContent()}</div>
      </main>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  if (!isLoggedIn) return <LoginScreen onLogin={() => setIsLoggedIn(true)} user={INITIAL_USER} />;
  return <DashboardApp user={INITIAL_USER} onLogout={() => setIsLoggedIn(false)} />;
}
