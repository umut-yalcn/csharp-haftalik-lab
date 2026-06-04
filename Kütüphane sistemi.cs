/*Soru: Bir kütüphane otomasyonu için Kitap isimli bir sınıf tasarlamanız istenmektedir. Bu hafta sadece sınıfın iskeletini ve kurucu metotlarını oluşturacaksınız.

İstenenler:

Sınıf içerisinde aşağıdaki üye değişkenleri dışarıdan doğrudan erişime kapalı (private) olarak tanımlayınız:

kitapAdi (string)

yazarAdi (string)

sayfaSayisi (int)

yayinYili (int)


Sınıf için aşağıdaki kurallara uyan 4 farklı kurucu metot yazınız:

Önemli Kural: Sayfa sayısı dışarıdan girildiğinde 10 ile 1000 arasında olmalıdır. Eğer parametre olarak 1000'i aşan bir değer gelirse sayfaSayisi 1000, 10'un altında bir değer gelirse 10 olarak kabul edilip atanmalıdır.


1. Kurucu (Parametresiz): sayfaSayisi değeri 100, yayinYili 2024 olarak başlar. (Kitap ve yazar adlarına varsayılan değer atayınız).

2. Kurucu (Tek Parametreli): Sadece sayfaSayisi değerini dışarıdan parametre olarak alır (sınır kuralı uygulanmalıdır). yayinYili 2024 olarak atanır.

3. Kurucu (İki Parametreli): İlk parametre sayfaSayisi, ikinci parametre yayinYili değeridir. İlgili atamaları gerçekleştiriniz.

4. Kurucu (İkiden Fazla Parametreli): params int[] kullanarak sınırsız tam sayı parametresi alabilen bir kurucu yazınız. Gelen değerlerden sadece ilkini sayfaSayisi, ikincisini yayinYili olarak ilgili değişkenlere atayınız. (Diğer parametreleri göz ardı ediniz).*/

using System;

namespace KitapOrnegi
{
    class Program
    {
        static void Main()
        {
            // Örnek kitaplar oluştur
            Kitap kaynak = new Kitap("Kaynak Kitap", "Yazar A", 120, 2020);
            Kitap rakip = new Kitap("Rakip Kitap", "Yazar B", 100, 2019);

            kaynak.kiyasla(rakip); // Kaynak kitap rakiple kıyasla
            kaynak.bilgiGoster();  // Kaynak kitabın güncel bilgisi
            rakip.bilgiGoster();   // Rakip kitabın güncel bilgisi
        }
    }

    class Kitap
    {
        public string kitapAdi;
        public string yazarAdi;
        public int sayfaSayisi;
        public int yayinYili;

        // Kurucu: kitap bilgilerini alıp nesneyi hazırlar
        public Kitap(string kitapAdi, string yazarAdi, int sayfaSayisi, int yayinYili)
        {
            this.kitapAdi = kitapAdi;
            this.yazarAdi = yazarAdi;
            this.sayfaSayisi = sayfaSayisi;
            this.yayinYili = yayinYili;
        }

        // Kaynak kitabın, rakiap kitapla sayfa syısı bazlı kıyaslaması
        public void kiyasla(Kitap rakip)
        {
            if (this.sayfaSayisi >= rakip.sayfaSayisi)
            {
                rakip.yipran(20);   // Rakip 20 sayfa kaybeder
                this.yayinYili += 1; // Kaynak kitap yeni baskı almış gibi 1 yıl artar
            }
        }

        // Kitabın yıpranma işlemi
        public void yipran(int miktar)
        {
            sayfaSayisi -= miktar; // Sayfa sayısını azalt

            if (sayfaSayisi <= 0)
            {
                Console.WriteLine("Kitap piyasadan kalktı"); // Okunamayacak duruma geldi
            }
            else if (sayfaSayisi < 50)
            {
                yayinYili -= 1; // 50'nin altına düşerse kitap eskir
            }
        }

        // Kitabın güncel bilgilerini ekrana yazdır
        public void bilgiGoster()
        {
            Console.WriteLine("Kitap Adı: " + kitapAdi);
            Console.WriteLine("Yazar Adı: " + yazarAdi);
            Console.WriteLine("Sayfa Sayısı: " + sayfaSayisi);
            Console.WriteLine("Yayın Yılı: " + yayinYili);
            Console.WriteLine(); // Araya boş satır ekle
        }
    }
}
