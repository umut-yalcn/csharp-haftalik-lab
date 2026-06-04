Alan hesaplama sistemi

/*Soru: Geometrik şekillerin alanını hesaplayabilen SekilAlan isimli bir sınıf tasarlamanız istenmektedir. Sınıfınızı aşağıdaki isterleri karşılayacak şekilde C# ile hazırlayınız.


İstenenler:


Üye Değişkenler: Sınıf içerisinde aşağıdaki 3 üye değişkeni tanımlayınız:

veri (double): Kurucu metottan gelen parametreleri tutacak.

tip (string): Şeklin tipini belirleyecek.

alan (double): Hesaplanan alan değerini tutacak.


Kurucu Metot (Constructor): Sınıftan nesne üretilirken değişken sayıda parametre alabilmesi için params anahtar kelimesini kullanabilirsiniz. (Örn: public SekilAlan(params double[] degerler))

Kurucu metoda gelen değerler veri değişkenine atanacaktır.

Gelen parametre sayısına göre tip değişkeni şu değerleri alacaktır:

Hiç parametre gelmiyorsa (0 parametre): tip = "bos", veri = 0 atanacak.

Tek parametre geliyorsa (1 parametre): tip = "daire" olacak.

İki parametre geliyorsa (2 parametre): tip = "dortgen" olacak.

İkiden fazla parametre gelirse (>2 parametre): tip = "tanimsiz", veri = -1 atanacak.


Üye Metotlar:

alanHesapla(): tip değişkenindeki değere göre alan hesabı yapıp sonucu alan değişkenine yazacaktır.

Tip "bos" veya "tanimsiz" ise alan sıfır olacaktır.

Tip "daire" ise dairenin alanı hesaplanacaktır.

Tip "dortgen" ise dörtgenin alanı hesaplanacaktır.

yazdir(): Şeklin tipini, girilen verileri ve hesaplanan alanı ekrana düzenli bir şekilde yazdıracaktır.


Main Metodu (Örnek Kullanım):

SekilAlan s1 = new SekilAlan(2.5);
s1.alanHesapla();
s1.yazdir();*/


using System;

namespace SekilAlan
{
    class Program
    {
        static void Main()
        {
            SekilAlan s1 = new SekilAlan(2.5); // Daire (1 parametre)
            s1.alanHesapla();
            s1.yazdir();

            Console.WriteLine();

            SekilAlan s2 = new SekilAlan(4, 5); // Dörtgen (2 parametre)
            s2.alanHesapla();
            s2.yazdir();

            Console.WriteLine();

            SekilAlan s3 = new SekilAlan(); // Boş (0 parametre)
            s3.alanHesapla();
            s3.yazdir();
        }
    }

    class SekilAlan
    {
        private double veri; // Parametreleri tutacak
        private string tip;  // Şeklin tipini belirtecek
        private double alan; // Hesaplanan alan

        public SekilAlan(params double[] degerler)
        {
            if (degerler.Length == 0)
            {
                tip = "bos"; // Parametre yoksa boş
                veri = 0;
            }
            else if (degerler.Length == 1)
            {
                tip = "daire"; // 1 parametre: daire
                veri = degerler[0];
            }
            else if (degerler.Length == 2)
            {
                tip = "dortgen"; // 2 parametre: dörtgen
                veri = degerler[0] * degerler[1]; // Çarpımı veri'ye kaydet
            }
            else
            {
                tip = "tanimsiz"; // 2'den fazla: tanımsız
                veri = -1;
            }
        }

        public void alanHesapla()
        {
            if (tip == "bos" || tip == "tanimsiz")
                alan = 0; // Boş veya tanımsız ise alan 0
            else if (tip == "daire")
                alan = Math.PI * veri * veri; // Daire alanı: πr²
            else if (tip == "dortgen")
                alan = veri; // Dörtgen alanı: zaten veri'de var
        }

        public void yazdir()
        {
            Console.WriteLine("Şekil Tipi: " + tip);
            Console.WriteLine("Girilen Veri: " + veri);
            Console.WriteLine("Hesaplanan Alan: " + alan);
        }
    }
}