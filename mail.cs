/*E-Posta Adresi Analizi

Soru: Klavyeden girilen bir e-posta adresinin geçerliliğini ve detaylarını string metotları kullanarak analiz eden bir C# programı yazınız. (İşlemleri gerçekleştirmek için bir MailAnaliz sınıfı oluşturmanız beklenmektedir.)

Geçerlilik Kriterleri:

Metin içerisinde mutlaka bir adet "@" işareti bulunmalıdır.

Adres içerisinde boşluk karakteri (space) yer almamalıdır.

Adres ".com", ".edu" veya ".net" uzantılarından biriyle bitmelidir.

İstenen Çıktılar:

Adres yukarıdaki kriterleri sağlamıyorsa ekrana: "Geçersiz e-posta formatı!" yazdırılmalıdır.

Adres geçerli ise:

Kullanıcının hesap adını (@ işaretinden önceki kısım) ayrıştırıp ekrana yazdırınız (Örn: ornek.metin@gmail.com için ornek.metin).

E-posta servis sağlayıcısının adını (@ ile . arasındaki kısım) ekrana yazdırınız (Örn: gmail, hotmail, yahoo vb.).

Uzantısına göre hesap türünü yazdırınız (.com ise "Ticari", .edu ise "Eğitim", .net ise "Ağ", hiçbiri değilse "Diğer" yazdırın).*/

using System;

namespace EpostaAnalizi
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Write("E-posta adresini giriniz: "); // Kullanıcıdan e-posta al
            string mail = Console.ReadLine().ToLower().Trim(); // Küçült ve boşlukları temizle

            if (MailAnaliz.GecerliMi(mail)) // E-posta geçerli ise
            {
                Console.WriteLine("\n--- ANALİZ SONUÇLARI ---");
                Console.WriteLine("Hesap Adı: " + MailAnaliz.HesapAdıBul(mail)); // Hesap adını yaz
                Console.WriteLine("Servis Sağlayıcı: " + MailAnaliz.ServisBul(mail)); // Servis sağlayıcıyı yaz
                Console.WriteLine("Hesap Türü: " + MailAnaliz.TurBul(mail)); // Hesap türünü yaz
            }
            else
            {
                Console.WriteLine("Geçersiz e-posta formatı!"); // Hata mesajı
            }
            Console.ReadLine(); // Program kapanmadan önce bekle
        }
    }

    static class MailAnaliz
    {
        // E-posta geçerliliğini kontrol eder
        public static bool GecerliMi(string mail)
        {
            return mail.IndexOf('@') != -1
                && mail.IndexOf('@') == mail.LastIndexOf('@')
                && !mail.Contains(" ")
                && (mail.EndsWith(".com") || mail.EndsWith(".edu") || mail.EndsWith(".net"));
        }

        // Hesap adını döndürür
        public static string HesapAdıBul(string mail)
        {
            return mail.Substring(0, mail.IndexOf('@'));
        }

        // Servis sağlayıcıyı döndürür
        public static string ServisBul(string mail)
        {
            int baslangic = mail.IndexOf('@') + 1;
            int noktaIndeks = mail.IndexOf('.', baslangic);
            return mail.Substring(baslangic, noktaIndeks - baslangic);
        }

        // Uzantıya göre hesap türünü belirler
        public static string TurBul(string mail)
        {
            if (mail.EndsWith(".com")) return "Ticari";
            if (mail.EndsWith(".edu")) return "Eğitim";
            if (mail.EndsWith(".net")) return "Ağ";
            return "Diğer";
        }
    }
}
