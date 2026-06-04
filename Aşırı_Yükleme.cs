//Aşırı yükleme (tekrar dönülecek)

/*Soru: Vektor isimli bir sınıf tasarlayarak nesneler arasında matematiksel ve mantıksal operatörleri aşırı yüklemeniz (overload) istenmektedir.


Sınıf Özellikleri ve İstenen Kurallar:

Üye Değişken: Sınıf içerisinde elemanları tutmak için ArrayList tipinde bir üye değişken tanımlayınız.

Kurucu Metot (Constructor): Sınıftan her yeni nesne türetildiğinde çalışacak parametresiz bir kurucu metot yazınız. Bu metot, vektörün içine 0 ile 20 arasında rastgele (random) üretilmiş 10 adet tam sayı eklemelidir.

Operatör Aşırı Yükleme (Operator Overloading):

+ Operatörü: İki vektör nesnesi toplandığında (A + B), iki vektörün aynı indisteki elemanları karşılıklı olarak toplanmalı ve sonuç yeni bir vektör nesnesi olarak döndürülmelidir.

* Operatörü: İki vektör nesnesi çarpıldığında (A * B), iki vektörün karşılıklı elemanları çarpılmalı ve sonuç yeni bir vektör nesnesi olarak döndürülmelidir.

== Operatörü (Opsiyonel / Ekstra Puan): İki vektör karşılaştırıldığında (A == B); A vektörünün içindeki tüm elemanların toplamı, B vektörünün içindeki tüm elemanların toplamına eşitse true, değilse false döndürmelidir.

Üye Metot:  yazdir(): Vektörün içindeki elemanları yan yana, aralarında boşluk (veya sekme) olacak şekilde konsola yazdıran bir metot yazınız. (Her yazdırma işleminden önce ekrana "vektor:" ibaresi eklenmelidir).


Main Metodu (Örnek Kullanım):

Vektor v1 = new Vektor();
Vektor v2 = new Vektor();
Vektor v3 = new Vektor();

// Çarpma işlemini test etme
v3 = v1 * v2;

v1.yazdir();
v2.yazdir();
v3.yazdir();*/

using System;
using System.Collections;

namespace VektorOrnek
{
    class Program
    {
        static void Main()
        {
            Vektor v1 = new Vektor(); // Rastgele 10 elemanlı vektör
            Vektor v2 = new Vektor();
            Vektor v3 = new Vektor();

            v3 = v1 * v2; // Çarpma operatörünü test et

            v1.yazdir(); // v1'i yazdır
            v2.yazdir(); // v2'yi yazdır
            v3.yazdir(); // v3'ü yazdır

            Console.WriteLine("Toplam eşit mi? " + (v1 == v2));
        }
    }

    class Vektor
    {
        private ArrayList elemanlar; // Elemanları tutar
        private static Random rnd = new Random(); // Rastgele sayı üretici

        public Vektor()
        {
            elemanlar = new ArrayList();
            for (int i = 0; i < 10; i++)
                elemanlar.Add(rnd.Next(21)); // 0-20 arasında rastgele tam sayı
        }

        public static Vektor operator +(Vektor a, Vektor b)
        {
            Vektor sonuc = new Vektor();
            sonuc.elemanlar.Clear();
            for (int i = 0; i < 10; i++)
                sonuc.elemanlar.Add((int)a.elemanlar[i] + (int)b.elemanlar[i]);
            return sonuc;
        }

        public static Vektor operator *(Vektor a, Vektor b)
        {
            Vektor sonuc = new Vektor();
            sonuc.elemanlar.Clear();
            for (int i = 0; i < 10; i++)
                sonuc.elemanlar.Add((int)a.elemanlar[i] * (int)b.elemanlar[i]);
            return sonuc;
        }

        public static bool operator ==(Vektor a, Vektor b)
        {
            return Toplam(a) == Toplam(b); // Toplamları eşitse true
        }

        public static bool operator !=(Vektor a, Vektor b)
        {
            return !(a == b);
        }

        private static int Toplam(Vektor v)
        {
            int s = 0;
            foreach (int x in v.elemanlar)
                s += x;
            return s;
        }

        public void yazdir()
        {
            Console.Write("vektor: ");
            foreach (int x in elemanlar)
                Console.Write(x + " ");
            Console.WriteLine();
        }

        public override bool Equals(object obj)
        {
            return obj is Vektor v && this == v;
        }

        public override int GetHashCode()
        {
            return Toplam(this);
        }
    }
}

//bunu detaylı tekrar incele
