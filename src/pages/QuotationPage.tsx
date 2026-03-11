import React, { useState } from 'react';
import Card from '../components/Card';
import { useTranslation } from '../contexts/LanguageContext';
import { QrCodeIcon, LinkIcon, DownloadIcon, CheckCircleIcon } from '../components/icons';
import PromptPayQR from '../components/PromptPayQR';

interface QuotationItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

const QuotationPage: React.FC = () => {
    const { t, currentLang } = useTranslation();
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerTaxId, setCustomerTaxId] = useState('');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [applyWht, setApplyWht] = useState(false);
    const [notes, setNotes] = useState('');
    
    const [items, setItems] = useState<QuotationItem[]>([
        { id: '1', description: 'Service Fee', quantity: 1, price: 1000 }
    ]);
    const [isGenerated, setIsGenerated] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.07;
    const wht = applyWht ? subtotal * 0.03 : 0;
    const total = subtotal + tax - wht;

    const addItem = () => {
        setItems([...items, { id: Math.random().toString(36).substr(2, 9), description: '', quantity: 1, price: 0 }]);
    };

    const updateItem = (id: string, field: keyof QuotationItem, value: string | number) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(currentLang === 'th' ? 'th-TH' : 'en-US', {
            style: 'currency',
            currency: 'THB',
        }).format(amount);
    };

    return (
        <div className="animate-fadeIn max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary capitalize">
                        {t('paymentLink')} / {currentLang === 'th' ? 'ใบเสนอราคา' : 'Quotation'}
                    </h1>
                    <p className="text-text-secondary text-sm mt-1">{currentLang === 'th' ? 'สร้างลิงก์รับชำระเงินและใบเสนอราคาระดับองค์กร' : 'Create professional payment links and quotations.'}</p>
                </div>
                {isGenerated && (
                    <button 
                        onClick={() => setIsGenerated(false)} 
                        className="text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-primary transition-colors"
                    >
                        {currentLang === 'th' ? '← สร้างใหม่' : '← Create New'}
                    </button>
                )}
            </div>

            {!isGenerated ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary mb-6">{currentLang === 'th' ? 'ข้อมูลลูกค้า' : 'Customer Information'}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="customer-name" className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">{t('customer')}</label>
                                    <input 
                                        id="customer-name"
                                        type="text" 
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="Company or Individual Name"
                                        className="w-full bg-sidebar-bg/20 border border-border-color/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="customer-email" className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">{t('email')}</label>
                                    <input 
                                        id="customer-email"
                                        type="email" 
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        placeholder="customer@example.com"
                                        className="w-full bg-sidebar-bg/20 border border-border-color/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label htmlFor="customer-address" className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Address</label>
                                    <input 
                                        id="customer-address"
                                        type="text" 
                                        value={customerAddress}
                                        onChange={(e) => setCustomerAddress(e.target.value)}
                                        placeholder="123 Example St, City, Country"
                                        className="w-full bg-sidebar-bg/20 border border-border-color/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="customer-tax-id" className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Tax ID</label>
                                    <input 
                                        id="customer-tax-id"
                                        type="text" 
                                        value={customerTaxId}
                                        onChange={(e) => setCustomerTaxId(e.target.value)}
                                        placeholder="0123456789012"
                                        className="w-full bg-sidebar-bg/20 border border-border-color/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label htmlFor="issue-date" className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Issue Date</label>
                                    <input 
                                        id="issue-date"
                                        type="date" 
                                        value={issueDate}
                                        onChange={(e) => setIssueDate(e.target.value)}
                                        className="w-full bg-sidebar-bg/20 border border-border-color/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="due-date" className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Due Date</label>
                                    <input 
                                        id="due-date"
                                        type="date" 
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full bg-sidebar-bg/20 border border-border-color/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary mb-6">{currentLang === 'th' ? 'รายการสินค้า/บริการ' : 'Line Items'}</h2>
                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div key={item.id} className="flex gap-4 items-end animate-fadeIn">
                                        <div className="flex-1">
                                            {index === 0 && <label htmlFor={`item-desc-${item.id}`} className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">{t('description')}</label>}
                                            <input 
                                                id={`item-desc-${item.id}`}
                                                type="text" 
                                                value={item.description}
                                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                className="w-full bg-sidebar-bg/20 border border-border-color/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                            />
                                        </div>
                                        <div className="w-20">
                                            {index === 0 && <label htmlFor={`item-qty-${item.id}`} className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Qty</label>}
                                            <input 
                                                id={`item-qty-${item.id}`}
                                                type="number" 
                                                value={item.quantity}
                                                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                className="w-full bg-sidebar-bg/20 border border-border-color/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                            />
                                        </div>
                                        <div className="w-32">
                                            {index === 0 && <label htmlFor={`item-price-${item.id}`} className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Price (THB)</label>}
                                            <input 
                                                id={`item-price-${item.id}`}
                                                type="number" 
                                                value={item.price}
                                                onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                                className="w-full bg-sidebar-bg/20 border border-border-color/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                            />
                                        </div>
                                        <button 
                                            onClick={() => removeItem(item.id)}
                                            className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors mb-0.5"
                                        >
                                            <span className="text-xl">×</span>
                                        </button>
                                    </div>
                                ))}
                                <button 
                                    onClick={addItem}
                                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors py-2"
                                >
                                    + {currentLang === 'th' ? 'เพิ่มรายการ' : 'Add Item'}
                                </button>
                            </div>
                        </Card>

                        <Card>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary mb-6">Terms & Notes</h2>
                            <div>
                                <label htmlFor="client-notes" className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Client Notes</label>
                                <textarea 
                                    id="client-notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any additional terms, payment conditions, or notes here..."
                                    className="w-full h-24 bg-sidebar-bg/20 border border-border-color/60 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Right: Summary */}
                    <div className="space-y-6">
                        <Card>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary mb-6">{currentLang === 'th' ? 'สรุปยอด' : 'Summary'}</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Subtotal</span>
                                    <span className="font-bold">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">VAT (7%)</span>
                                    <span className="font-bold">{formatCurrency(tax)}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-y border-border-color/40">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" checked={applyWht} onChange={(e) => setApplyWht(e.target.checked)} className="sr-only" />
                                            <div className={`w-10 h-6 bg-border-color rounded-full transition-colors ${applyWht ? 'bg-primary' : ''}`}></div>
                                            <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${applyWht ? 'translate-x-4' : ''}`}></div>
                                        </div>
                                        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Apply WHT (3%)</span>
                                    </label>
                                    {applyWht && <span className="text-sm font-bold text-rose-500">-{formatCurrency(wht)}</span>}
                                </div>
                                <div className="pt-2 flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Total Due</span>
                                    <span className="text-2xl font-black text-primary tracking-tight">{formatCurrency(total)}</span>
                                </div>

                                <div className="flex justify-center">
                                    <div className="cf-turnstile mt-4" data-sitekey="0x4AAAAAACpKX1PxoaSTx8Kv"></div>
                                </div>

                                <button 
                                    onClick={async () => {
                                        try {
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            const token = (window as any).turnstile?.getResponse();
                                            const { generateQuotation } = await import('../services/edgeClient');
                                            const result = await generateQuotation({
                                                merchant_id: 'MERCH-001', 
                                                customer_email: customerEmail,
                                                total_due: total,
                                                items: items,
                                                turnstile_token: token || 'simulated_token',
                                                metadata: {
                                                    notes,
                                                    customerName,
                                                    customerAddress
                                                }
                                            });
                                            if (result) {
                                                setGeneratedLink(result.payment_link);
                                                setIsGenerated(true);
                                            }
                                        } catch (err) {
                                            console.error("Failed to generate quotation", err);
                                        }
                                    }}
                                    disabled={!customerName || total <= 0}
                                    className="w-full satin-effect text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] mt-4 shadow-satin hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                >
                                    {t('generateLink')}
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                    {/* Quotation Preview */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-sidebar-bg/10 rounded-[2rem] border border-border-color shadow-2xl overflow-hidden min-h-[600px] relative">
                            {/* Decorative Header */}
                            <div className="h-2 bg-primary w-full"></div>
                            <div className="p-12">
                                <div className="flex justify-between items-start mb-16">
                                    <div>
                                        <div className="text-3xl font-black tracking-tighter text-primary mb-2">XETAPAY</div>
                                        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">{currentLang === 'th' ? 'ใบเสนอราคาทางการ' : 'OFFICIAL QUOTATION'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-text-primary">QTN-{issueDate.replace(/-/g, '').substring(0, 8)}{Math.floor(Math.random() * 1000)}</div>
                                        <div className="text-[10px] text-text-secondary uppercase mt-1">Date: {new Date(issueDate).toLocaleDateString()}</div>
                                        <div className="text-[10px] text-text-secondary uppercase mt-1">Due: {new Date(dueDate).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-12 mb-16">
                                    <div>
                                        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-4">Bill To</div>
                                        <div className="text-lg font-bold text-text-primary">{customerName}</div>
                                        {customerAddress && <div className="text-sm text-text-secondary mt-1 whitespace-pre-line">{customerAddress}</div>}
                                        <div className="text-sm text-text-secondary mt-1">{customerEmail}</div>
                                        {customerTaxId && <div className="text-xs text-text-secondary mt-2 font-mono">Tax ID: {customerTaxId}</div>}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-4">From</div>
                                        <div className="text-lg font-bold text-text-primary">XETA Corporation CO., LTD.</div>
                                        <div className="text-sm text-text-secondary mt-1">1 Empire Tower, South Sathorn Rd<br/>Bangkok 10120, Thailand</div>
                                        <div className="text-xs text-text-secondary mt-2 font-mono">Tax ID: 0105562000000</div>
                                    </div>
                                </div>

                                <table className="w-full mb-16">
                                    <thead>
                                        <tr className="border-b-2 border-border-color text-[10px] font-black uppercase tracking-widest text-text-secondary">
                                            <th className="text-left py-4">Description</th>
                                            <th className="text-center py-4 w-20">Qty</th>
                                            <th className="text-right py-4 w-32">Price</th>
                                            <th className="text-right py-4 w-32">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map(item => (
                                            <tr key={item.id} className="border-b border-border-color/40 text-sm font-medium">
                                                <td className="py-6 active:text-primary transition-colors">{item.description}</td>
                                                <td className="py-6 text-center">{item.quantity}</td>
                                                <td className="py-6 text-right">{formatCurrency(item.price)}</td>
                                                <td className="py-6 text-right font-bold">{formatCurrency(item.price * item.quantity)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="flex justify-end pt-8">
                                    <div className="w-64 space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-secondary">Subtotal</span>
                                            <span className="font-bold">{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-secondary">VAT (7%)</span>
                                            <span className="font-bold">{formatCurrency(tax)}</span>
                                        </div>
                                        {applyWht && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-secondary">Withholding Tax (3%)</span>
                                                <span className="font-bold text-rose-500">-{formatCurrency(wht)}</span>
                                            </div>
                                        )}
                                        <div className="pt-4 border-t-2 border-primary flex justify-between items-center">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Total Due</span>
                                            <span className="text-2xl font-black text-primary tracking-tight">{formatCurrency(total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {notes && (
                                    <div className="mt-8 pt-8 border-t border-border-color/40">
                                        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Notes & Terms</div>
                                        <p className="text-sm text-text-primary whitespace-pre-line leading-relaxed">{notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="space-y-6">
                        <Card>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary mb-6">{currentLang === 'th' ? 'ลิงก์การชำระเงิน' : 'Payment Link Created'}</h2>
                            <div className="space-y-6">
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                        <CheckCircleIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Ready to Pay</div>
                                        <div className="text-xs text-emerald-800/70 font-medium">Link is active and secure</div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <label htmlFor="payment-link-input" className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Direct Payment Link</label>
                                    <div className="flex gap-2">
                                        <input 
                                            id="payment-link-input"
                                            readOnly
                                            value={generatedLink}
                                            className="flex-1 min-w-0 bg-sidebar-bg/20 border border-border-color/60 rounded-xl px-3 sm:px-4 py-3 text-[9px] sm:text-[10px] font-mono focus:outline-none"
                                        />
                                        <button 
                                            onClick={handleCopy}
                                            className="w-12 sm:w-14 shrink-0 flex items-center justify-center p-0 bg-white border border-border-color/60 rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0 relative overflow-hidden group"
                                        >
                                            {isCopied ? (
                                                <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 uppercase transition-all">Copied</span>
                                            ) : (
                                                <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary group-hover:text-primary transition-colors" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border-color/60 text-center">
                                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-6">{t('promptPay')}</p>
                                    <div className="scale-90 origin-top">
                                        <PromptPayQR amount={total} orderId="QTN-2026-X" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <button className="flex items-center justify-center gap-2 py-3 bg-white border border-border-color/60 rounded-xl text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:bg-gray-50 transition-colors icon-active-aura">
                                        <DownloadIcon className="w-4 h-4" />
                                        PDF
                                    </button>
                                    <button className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity icon-active-aura">
                                        <QrCodeIcon className="w-4 h-4" />
                                        Print QR
                                    </button>
                                </div>
                            </div>
                        </Card>
                        
                        <div className="p-8 bg-sidebar-bg/5 border border-dashed border-border-color/60 rounded-[2rem] text-center">
                            <p className="text-xs text-text-secondary italic">"Ensure all details are correct before sending the link to the client. This action is logged for compliance."</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuotationPage;
