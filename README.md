1. у папці src створил папку constants, куди у файл interactorConstants перенесла усі константи (PAGE_LINKS, InternalFileType, imagesFormat). У зв'язку з цим довелося оновити імпорти в деяких файлах (files.endpoint.ts, router.tsx та index.tsx у папці header)

2. створила змінну isQueryEmail для перевірки router.query?.fromEmail === "true", яка зустрічається у коді кілька разів

3. у функції onSelectPlan в блоці коду if видалила setSelectedPlan, тому що у state і так вже знаходиться цей план

4. React.useEffect (99 рядок)
   4.1. видалила наступний код 
 	if (user?.email !== null) {
      	  return;
 	}
бо вище є перевірка, що якщо імейлу не має, то юзер повертається на стрінку назад
   4.2 замінила router.query?.token у dependency array на router

5. у React.useEffect (116 рядок) спростила код 
  if (!localStorage.getItem("select_plan_view")) {
      console.log("send event analytic3");
  }

  localStorage.setItem("select_plan_view", "true");

  return () => {
      localStorage.removeItem("select_plan_view");
  };
до такого вигляду console.log("send event analytic3")

6. у React.useEffect (рядок 120)
   6.1. видалила знак оклику в цьому коді (item) => item.id === router.query!.file
   6.2. замінила такий запис setFile(res.files[res.files.length - 1]) на такий  setFile(res.files.at(-1))
   6.3. додала у dependency array router.query.file

7. у React.useEffect (рядок 136)
   7.1. замінила перевірку router.query?.fromEmail === "true" на isQueryEmail
   7.2. видалила зайвий return
   7.3. додала в dependency array isQueryEmail

8. у React.useEffect (рядок 143)
   8.1. перенесла функції loadPdfCover та loadImageCover у сам useEffect
   8.2. створила функцію getFileUrl та використала її для отримання посилання на файл у функціях loadPdfCover та loadImageCover
   8.3. у окремому файлі src/helpers/fileHelpres створила функцію isValidFileExtension для перевірки на коректний формат файлу.
Замінила перевірку у функції loadImageCover
!imagesFormat.includes(
  file.filename.slice(-3).toUpperCase() as InternalFileType
) ||
!imagesFormat.includes(
  file.filename.slice(-4).toUpperCase() as InternalFileType
) 
на !isValidFileExtension(file)
   8.4. замінилв dependency array з [loadImageCover, loadPdfCover] на [file, router.query]

9. функція getPlans
   9.1. функції getTrialFormattedPrice, getAnnualFormattedPrice та getCurrency винесла в окремий файл src/helpers/priceHelpers. У функціях 
getTrialFormattedPrice та getAnnualFormattedPrice видалила усі первірки та використала функцію getCurrency для отримання коректної валюти 
та ціни.
   9.2. створила файл src/helpers/plansHelpers, куди перенеслі типи Plan та Bullets та створила функцію getPlan, яка повертає об'єкт потрібного плана.
Замість того, щоб повертати масив об'єктів у функції getPlans, перебираю масив продуктів та на кожному продукті викликаю функцію getPlan з потрібними аргументами.

10. у return замінила деякі тернарні оператори на оператори нульового порівняння та замінила значення полей isSecondEmail та isThirdEmail з router.query?.fromEmail === "true" на isQueryEmail

11. також створила функцію createBullet у файлі plansHelpers, яка повертає об'єкт булета з потрібними даними. Використовується у функції getPlan.