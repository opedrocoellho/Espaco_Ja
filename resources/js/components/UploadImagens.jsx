import React, { useState, useRef } from 'react';

const UploadImagens = ({ imagens = [], onChange, required = false }) => {
    const [previews, setPreviews] = useState(imagens.map(img => ({ 
        url: `${window.location.protocol === 'https:' ? 'https:' : 'http:'}//${window.location.host}/storage/${img}`, 
        isExisting: true 
    })));
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);

        try {
            const newPreviews = [];
            const newImages = [];

            for (const file of files) {
                // Validar tipo de arquivo com lista de tipos permitidos (secure)
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                if (!allowedTypes.includes(file.type.toLowerCase())) {
                    // Secure error handling
                    if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
                        alert(`${file.name} não é um tipo de imagem válido. Tipos permitidos: JPG, PNG, GIF, WebP`);
                    } else {
                        console.error('Conexão insegura detectada. Use HTTPS em produção.');
                        return;
                    }
                    continue;
                }

                // Validar tamanho (máximo 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    // Secure error handling
                    if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
                        alert(`${file.name} é muito grande. Máximo 5MB`);
                    } else {
                        console.error('Conexão insegura detectada. Use HTTPS em produção.');
                        return;
                    }
                    continue;
                }
                
                // Validar nome do arquivo
                const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                if (sanitizedFileName !== file.name) {
                    console.warn(`Nome do arquivo sanitizado: ${file.name} -> ${sanitizedFileName}`);
                }

                // Criar preview
                const previewUrl = URL.createObjectURL(file);
                newPreviews.push({ url: previewUrl, file, isExisting: false });

                // Upload do arquivo com validação adicional
                const formData = new FormData();
                formData.append('image', file);
                
                // Validar CSRF token antes do upload
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                if (!csrfToken) {
                    throw new Error('CSRF token não encontrado');
                }
                formData.append('_token', csrfToken);

                try {
                    // Validate CSRF token exists
                    if (!csrfToken) {
                        throw new Error('CSRF token validation failed');
                    }
                    
                    // HTTPS check removed for development
                    
                    const response = await fetch('/api/upload-image', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('auth_token') || ''}`,
                            'X-Requested-With': 'XMLHttpRequest',
                            ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken })
                        },
                        body: formData,
                        credentials: 'same-origin'
                    });

                    if (response.ok) {
                        const result = await response.json();
                        newImages.push(result.path);
                    } else {
                        throw new Error('Erro no upload');
                    }
                } catch (error) {
                    console.error('Erro no upload:', error);
                    alert(`Erro ao fazer upload de ${file.name}`);
                }
            }

            // Atualizar previews e chamar onChange
            const updatedPreviews = [...previews, ...newPreviews];
            setPreviews(updatedPreviews);
            
            const allImages = [
                ...imagens,
                ...newImages
            ];
            onChange(allImages);

        } catch (error) {
            console.error('Erro no upload:', error);
        } finally {
            setUploading(false);
        }
    };

    const removerImagem = (index) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        setPreviews(newPreviews);

        // Atualizar lista de imagens
        const newImages = newPreviews
            .filter(p => p.isExisting)
            .map(p => p.url.replace('/storage/', ''));
        onChange(newImages);
    };

    const abrirSeletor = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagens do Espaço {required && '*'}
            </label>
            
            {/* Grid de Imagens */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                        <img
                            src={preview.url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={() => removerImagem(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            ×
                        </button>
                        {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                                Principal
                            </div>
                        )}
                    </div>
                ))}

                {/* Botão de Adicionar */}
                <button
                    type="button"
                    onClick={abrirSeletor}
                    disabled={uploading}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50"
                >
                    {uploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                    ) : (
                        <>
                            <div className="text-2xl mb-1">📷</div>
                            <span className="text-sm text-gray-500">Adicionar</span>
                        </>
                    )}
                </button>
            </div>

            {/* Input de Arquivo Oculto */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Informações */}
            <div className="text-xs text-gray-500">
                <p>• Primeira imagem será a principal</p>
                <p>• Formatos aceitos: JPG, PNG, GIF</p>
                <p>• Tamanho máximo: 5MB por imagem</p>
                {required && previews.length === 0 && (
                    <p className="text-red-500 mt-1">• Pelo menos uma imagem é obrigatória</p>
                )}
            </div>
        </div>
    );
};

export default UploadImagens;