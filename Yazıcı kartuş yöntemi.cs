Yazıcı kartuş yöntemi

/*
Soru: Akıllı bir ofis yazıcısının kartuş durumunu yönetecek Yazici isimli bir sınıf tasarlamanız istenmektedir. Sınıfınızı aşağıdaki isterleri karşılayacak şekilde C# ile hazırlayınız.


İstenenler:

Değişkenler ve Kapsülleme: marka (string), maxMurekkep (int) ve guncelMurekkep (int) değişkenlerini private olarak tanımlayınız.

Kural: maxMurekkep değeri için bir Property (get/set) yazınız. Eğer dışarıdan 500'den küçük bir kapasite girilmek istenirse, kapasite otomatik olarak 500 kabul edilmelidir.


Kurucu Metot (Constructor): Dışarıdan marka ve maxMurekkep bilgilerini parametre olarak alıp atamalarını yapınız. Yazıcı ilk üretildiğinde guncelMurekkep değeri otomatik olarak 0 atanmalıdır.


Üye Metotlar:

kartusDoldur(int miktar): Gelen miktarı güncel mürekkebin üzerine ekler. Kural: Eğer ekleme sonucunda güncel mürekkep, maxMurekkep kapasitesini aşıyorsa; güncel mürekkebi maksimum kapasiteye eşitleyip ekrana "Kartuş tam doldu!" yazdırmalıdır.

belgeYazdir(int sayfa): Çıktı alınacak her 1 sayfa, 5 birim mürekkep harcamaktadır. Metot öncelikle gereken mürekkep miktarını hesaplamalıdır. Eğer güncel mürekkep bu işlem için yeterliyse mürekkepten düşüp "Belgeler yazdırıldı", yetersizse "Mürekkep yetersiz!" uyarısı vermelidir.

bilgiGoster(): Yazıcının markasını ve mürekkep durumunu (Güncel / Maksimum şeklinde) ekrana yazdırır.


Main Metodu (Örnek Kullanım): 1 adet yazıcı nesnesi üretip doldurma ve yazdırma metotlarını test ediniz.
*/

using System;

namespace YaziciSistemi
{
    class Program
    {
        static void Main()
        {
            Yazici yazici = new Yazici("Canon", 600); // Yazıcı oluştur

            yazici.kartusDoldur(400); // Kartuş doldur
            yazici.belgeYazdir(50);   // 50 sayfa yazdır
            yazici.bilgiGoster();     // Durumu göster
        }
    }

    class Yazici
    {
        private string marka;
        private int maxMurekkep;
        private int guncelMurekkep;

        public int MaxMurekkep
        {
            get => maxMurekkep;
            set => maxMurekkep = value < 500 ? 500 : value; // 500'den küçükse 500 kabul et
        }

        public Yazici(string marka, int maxMurekkep)
        {
            this.marka = marka;
            MaxMurekkep = maxMurekkep; // Property üzerinden ata
            guncelMurekkep = 0; // İlk başta boş
        }

        public void kartusDoldur(int miktar)
        {
            guncelMurekkep += miktar; // Mürekkep ekle

            if (guncelMurekkep >= maxMurekkep)
            {
                guncelMurekkep = maxMurekkep; // Taşarsa maksimuma eşitle
                Console.WriteLine("Kartuş tam doldu!");
            }
        }

        public void belgeYazdir(int sayfa)
        {
            int gerekliMurekkep = sayfa * 5; // Her sayfa 5 birim harca

            if (guncelMurekkep >= gerekliMurekkep)
            {
                guncelMurekkep -= gerekliMurekkep; // Mürekkep harca
                Console.WriteLine("Belgeler yazdırıldı");
            }
            else
            {
                Console.WriteLine("Mürekkep yetersiz!");
            }
        }

        public void bilgiGoster()
        {
            Console.WriteLine("Marka: " + marka);
            Console.WriteLine("Mürekkep Durumu: " + guncelMurekkep + " / " + maxMurekkep);
        }
    }
}