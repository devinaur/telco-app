import Swal from "sweetalert2";
import { topUpBalance } from "../../data/api.js";

export default class TopupPage {
    formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    }
    
    render() {
        const nominalOptions = [
            10000, 25000, 50000, 100000, 250000, 500000
        ];

        const paymentMethods = [
            { id: 'bca_va', name: 'BCA Virtual Account', fee: 'Gratis' },
            { id: 'gopay', name: 'GoPay', fee: 'Rp 1.000' },
            { id: 'cc_visa', name: 'Kartu Kredit / Debit', fee: '2.9% + Rp 2.000' },
        ];

        const formatRupiah = this.formatRupiah;

        return `
            <div class="container mx-auto p-4 md:p-8" style="max-width: 1000px;">
                <h1 class="text-2xl font-semibold text-gray-800 mb-6">Isi Saldo (Top Up)</h1>

                <div class="flex flex-col md:flex-row gap-6">

                    <div class="md:w-3/5 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                        <div class="p-6">
                            <h2 class="text-xl font-bold text-gray-700 mb-4">1. Pilih Nominal Top Up</h2>
                            
                            <div id="nominal-grid" class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                                ${nominalOptions.map(nominal => `
                                    <div 
                                        class="nominal-option cursor-pointer p-3 text-center border rounded-lg transition duration-150 ease-in-out 
                                            border-gray-300 hover:border-purple-500 hover:shadow-sm hover:ring-2 hover:ring-purple-100"
                                        data-nominal="${nominal}"
                                    >
                                        <div class="font-semibold text-lg">${formatRupiah(nominal)}</div>
                                        <div class="text-xs text-gray-500">Saldo</div>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="mt-6">
                                <label for="custom-nominal" class="block text-sm font-medium text-gray-700 mb-1">Nominal Lain:</label>
                                <input 
                                    type="number" 
                                    id="custom-nominal" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-lg" 
                                    placeholder="Min. ${formatRupiah(10000)}" 
                                    min="10000"
                                >
                            </div>
                        </div>
                    </div>

                    <div class="md:w-2/5 flex flex-col gap-6">

                        <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                            <div class="p-6">
                                <h2 class="text-xl font-bold text-gray-700 mb-4">2. Pilih Pembayaran</h2>

                                <div id="payment-method-list">
                                    ${paymentMethods.map(method => `
                                        <div 
                                            class="payment-method-item flex items-center p-3 border rounded-lg mb-2 cursor-pointer transition duration-150 ease-in-out 
                                                border-gray-300 hover:border-purple-500"
                                            data-method="${method.id}"
                                        >
                                            <div class="w-8 h-8 bg-gray-100 rounded-sm mr-4 flex items-center justify-center text-xs font-bold text-gray-500">
                                                ${method.id.toUpperCase().substring(0, 2)}
                                            </div>
                                            <div class="flex-grow">
                                                <div class="font-semibold text-gray-800">${method.name}</div>
                                                <div class="text-xs text-gray-500">Biaya Admin: ${method.fee}</div>
                                            </div>
                                            <input type="radio" name="payment-method" value="${method.id}" class="h-4 w-4 text-purple-600 focus:ring-purple-500 ml-2" />
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                            <div class="bg-gray-50 p-6">
                                <h3 class="text-xl font-bold text-gray-700 mb-4">Total Pembayaran</h3>
                                
                                <div class="flex justify-between text-base text-gray-600 mb-3">
                                    <span>Nominal Top Up:</span>
                                    <span id="display-nominal" class="font-semibold">${formatRupiah(0)}</span>
                                </div>
                                <div class="flex justify-between text-base text-gray-600 mb-4 border-b pb-4">
                                    <span>Biaya Layanan:</span>
                                    <span id="display-fee" class="font-semibold">${formatRupiah(0)}</span>
                                </div>
                                
                                <div class="flex justify-between text-xl font-extrabold text-purple-600">
                                    <span>Total Bayar:</span>
                                    <span id="display-total">${formatRupiah(0)}</span>
                                </div>

                                <button 
                                    id="pay-button" 
                                    class="mt-6 w-full py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-900 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled
                                >
                                    Bayar Sekarang
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;
    }

    afterRender() {
        const payButton = document.getElementById('pay-button');
        const nominalOptions = document.querySelectorAll('.nominal-option');
        const customNominalInput = document.getElementById('custom-nominal');
        const paymentMethodItems = document.querySelectorAll('.payment-method-item');
        const displayNominal = document.getElementById('display-nominal');
        const displayFee = document.getElementById('display-fee');
        const displayTotal = document.getElementById('display-total');

        let selectedNominal = 0;
        let selectedMethod = null;
        
        const formatRupiah = this.formatRupiah;

        const updateSummary = () => {
            let fee = 0;
            const nominal = selectedNominal || 0;
            
            if (selectedMethod === 'gopay') {
                fee = 1000;
            } else if (selectedMethod === 'cc_visa') {
                fee = Math.round((nominal * 0.029) + 2000);
            }

            const total = nominal + fee;

            displayNominal.textContent = formatRupiah(nominal);
            displayFee.textContent = formatRupiah(fee);
            displayTotal.textContent = formatRupiah(total);
            
            if (nominal >= 10000 && selectedMethod) {
                payButton.removeAttribute('disabled');
            } else {
                payButton.setAttribute('disabled', 'true');
            }
        };

        const presetAmount = localStorage.getItem('topup_preset_amount');
        const presetMethod = localStorage.getItem('topup_preset_method');

        if (presetAmount) {
            const amount = parseInt(presetAmount);
            let matchFound = false;

            nominalOptions.forEach(opt => {
                if (parseInt(opt.dataset.nominal) === amount) {
                    opt.click();
                    matchFound = true;
                }
            });

            if (!matchFound) {
                selectedNominal = amount;
                customNominalInput.value = amount;
                nominalOptions.forEach(opt => opt.classList.remove('bg-purple-100', 'border-purple-500', 'text-purple-700'));
            }

            localStorage.removeItem('topup_preset_amount');
        }

        if (presetMethod) {
            paymentMethodItems.forEach(item => {
                if(item.dataset.method === presetMethod) {
                    const radio = item.querySelector('input[type="radio"]');
                    radio.checked = true;
                    selectedMethod = presetMethod;
                    
                    paymentMethodItems.forEach(i => i.classList.remove('bg-purple-50', 'border-purple-500'));
                    item.classList.add('bg-purple-50', 'border-purple-500');
                }
            });
            localStorage.removeItem('topup_preset_method');
        }

        updateSummary();

        nominalOptions.forEach(option => {
            option.addEventListener('click', () => {
                nominalOptions.forEach(opt => opt.classList.remove('bg-purple-100', 'border-purple-500', 'text-purple-700'));
                option.classList.add('bg-purple-100', 'border-purple-500', 'text-purple-700');
                
                selectedNominal = parseInt(option.dataset.nominal);
                customNominalInput.value = '';
                updateSummary();
            });
        });

        customNominalInput.addEventListener('input', (e) => {
            const inputVal = parseInt(e.target.value);
            selectedNominal = inputVal >= 10000 ? inputVal : 0;
            nominalOptions.forEach(opt => opt.classList.remove('bg-purple-100', 'border-purple-500', 'text-purple-700'));
            updateSummary();
        });

        paymentMethodItems.forEach(item => {
            const radio = item.querySelector('input[type="radio"]');
            
            item.addEventListener('click', () => {
                radio.checked = true;
                selectedMethod = item.dataset.method;
                
                paymentMethodItems.forEach(i => i.classList.remove('bg-purple-50', 'border-purple-500'));
                item.classList.add('bg-purple-50', 'border-purple-500');
                
                updateSummary();
            });

            radio.addEventListener('change', () => {
                if (radio.checked) {
                    selectedMethod = item.dataset.method;
                    paymentMethodItems.forEach(i => i.classList.remove('bg-purple-50', 'border-purple-500'));
                    item.classList.add('bg-purple-50', 'border-purple-500');
                    updateSummary();
                }
            });
        });

        payButton.addEventListener('click', async () => {
            const userId = localStorage.getItem("user_id");
            
            if (!userId) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Silakan login terlebih dahulu',
                    confirmButtonColor: '#d33'
                });
                return;
            }

            if (selectedNominal >= 10000 && selectedMethod) {
                Swal.fire({
                    title: 'Memproses Pembayaran...',
                    html: 'Mohon tunggu sebentar',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                });

                try {
                    const result = await topUpBalance(userId, selectedNominal, selectedMethod);

                    if (result.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Top Up Berhasil!',
                            text: `Saldo Anda berhasil bertambah menjadi ${formatRupiah(result.new_balance)}`,
                            confirmButtonColor: '#5C3E94'
                        }).then(() => {
                            window.location.hash = "#/";
                        });
                    } else {
                        throw new Error(result.message || 'Gagal Top Up');
                    }

                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message || 'Gagal terhubung ke server',
                        confirmButtonColor: '#d33'
                    });
                }
            } else {
                Swal.fire('Perhatian', 'Mohon pilih nominal top up (minimal Rp 10.000) dan metode pembayaran.', 'warning');
            }
        });
    }
}