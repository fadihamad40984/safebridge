# دليل الترحيل - Migration Guide
## SafeBridge Authentication System Update

هذا الدليل يشرح كيفية ترحيل البيانات الموجودة من النظام القديم إلى النظام الجديد.

---

## ⚠️ تحذير مهم

**قبل تطبيق أي تغييرات، قم بعمل نسخة احتياطية من قاعدة البيانات!**

```bash
# MongoDB backup
mongodump --db=safebridge --out=/path/to/backup
```

---

## 🔄 خطوات الترحيل

### الطريقة 1: البدء من الصفر (موصى بها للتطوير)

إذا كنت في مرحلة التطوير ولا توجد بيانات حقيقية مهمة:

```bash
# حذف قاعدة البيانات القديمة والبدء من جديد
mongo
> use safebridge
> db.dropDatabase()
> exit
```

ثم أعد تشغيل التطبيق وسجل مستخدمين جدد.

---

### الطريقة 2: ترحيل البيانات الموجودة

إذا كنت تريد الاحتفاظ بالبيانات الموجودة:

#### الخطوة 1: إضافة حقل email للمستخدمين الحاليين

قم بتشغيل هذا السكريبت في MongoDB:

```javascript
// الاتصال بقاعدة البيانات
use safebridge;

// إضافة بريد إلكتروني مؤقت لكل مستخدم ليس لديه بريد
db.users.find({ email: { $exists: false } }).forEach(function(user) {
  // توليد بريد مؤقت من الاسم
  var tempEmail = user.name
    .toLowerCase()
    .replace(/\s+/g, '')  // إزالة المسافات
    .replace(/[^a-z0-9]/g, '')  // إزالة الأحرف الخاصة
    + '_' + user._id.toString().substring(0, 6)
    + '@temp-safebridge.com';
  
  db.users.updateOne(
    { _id: user._id },
    { $set: { email: tempEmail } }
  );
  
  print('Updated user: ' + user.name + ' with email: ' + tempEmail);
});
```

#### الخطوة 2: تحويل linkedChild إلى linkedChildren

```javascript
// تحويل الأولياء من linkedChild إلى linkedChildren
db.users.find({ 
  role: 'parent', 
  linkedChild: { $exists: true } 
}).forEach(function(user) {
  // تحويل ObjectId الواحد إلى Array
  db.users.updateOne(
    { _id: user._id },
    { 
      $set: { linkedChildren: [user.linkedChild] },
      $unset: { linkedChild: "" }
    }
  );
  
  print('Migrated parent: ' + user.name);
});
```

#### الخطوة 3: تنظيف linkedChildren من حسابات الأطفال

```javascript
// إزالة linkedChildren من حسابات الأطفال (غير مطلوب لهم)
db.users.updateMany(
  { role: 'child', linkedChildren: { $exists: true } },
  { $unset: { linkedChildren: "" } }
);
```

#### الخطوة 4: التحقق من النتائج

```javascript
// التحقق من عدد المستخدمين بدون email
var usersWithoutEmail = db.users.count({ email: { $exists: false } });
print('Users without email: ' + usersWithoutEmail);

// التحقق من عدد الأولياء مع linkedChild القديم
var parentsWithOldField = db.users.count({ 
  role: 'parent', 
  linkedChild: { $exists: true } 
});
print('Parents with old linkedChild field: ' + parentsWithOldField);

// التحقق من عدد الأولياء مع linkedChildren الجديد
var parentsWithNewField = db.users.count({ 
  role: 'parent', 
  linkedChildren: { $exists: true } 
});
print('Parents with new linkedChildren field: ' + parentsWithNewField);
```

---

## 📝 سكريبت ترحيل كامل

احفظ هذا في ملف `migration.js`:

```javascript
// migration.js
// تشغيل: mongo safebridge migration.js

print('=== Starting SafeBridge Migration ===\n');

// 1. Add email to users without it
print('Step 1: Adding email field...');
var updatedUsers = 0;
db.users.find({ email: { $exists: false } }).forEach(function(user) {
  var tempEmail = user.name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '')
    + '_' + user._id.toString().substring(0, 6)
    + '@temp-safebridge.com';
  
  db.users.updateOne(
    { _id: user._id },
    { $set: { email: tempEmail } }
  );
  updatedUsers++;
});
print('✓ Added email to ' + updatedUsers + ' users\n');

// 2. Convert linkedChild to linkedChildren
print('Step 2: Converting linkedChild to linkedChildren...');
var migratedParents = 0;
db.users.find({ 
  role: 'parent', 
  linkedChild: { $exists: true } 
}).forEach(function(user) {
  db.users.updateOne(
    { _id: user._id },
    { 
      $set: { linkedChildren: [user.linkedChild] },
      $unset: { linkedChild: "" }
    }
  );
  migratedParents++;
});
print('✓ Migrated ' + migratedParents + ' parents\n');

// 3. Clean up linkedChildren from children
print('Step 3: Cleaning up children accounts...');
var result = db.users.updateMany(
  { role: 'child', linkedChildren: { $exists: true } },
  { $unset: { linkedChildren: "" } }
);
print('✓ Cleaned ' + result.modifiedCount + ' child accounts\n');

// 4. Verification
print('=== Verification ===');
print('Total users: ' + db.users.count());
print('Users without email: ' + db.users.count({ email: { $exists: false } }));
print('Parents with old linkedChild: ' + db.users.count({ 
  role: 'parent', 
  linkedChild: { $exists: true } 
}));
print('Parents with new linkedChildren: ' + db.users.count({ 
  role: 'parent', 
  linkedChildren: { $exists: true, $ne: [] } 
}));
print('Children: ' + db.users.count({ role: 'child' }));

print('\n=== Migration Complete ===');
```

لتشغيله:

```bash
mongo safebridge migration.js
```

---

## 🔍 التحقق بعد الترحيل

### 1. التحقق من البيانات في قاعدة البيانات:

```javascript
// عرض بعض المستخدمين للتحقق
db.users.find().limit(5).pretty()

// التحقق من أن كل مستخدم لديه email
db.users.find({ email: { $exists: false } }).count()
// يجب أن يكون 0

// التحقق من الأولياء
db.users.find({ role: 'parent' }).forEach(function(p) {
  print(p.name + ' - Email: ' + p.email + ' - Children: ' + (p.linkedChildren ? p.linkedChildren.length : 0));
});
```

### 2. اختبار تسجيل الدخول:

- جرب تسجيل الدخول بالبريد الإلكتروني المؤقت
- إذا نجح، قم بتحديث البريد إلى بريد حقيقي

### 3. اختبار إنشاء مستخدمين جدد:

- سجل طفل جديد بالبريد الإلكتروني
- سجل ولي أمر جديد
- جرب ربط طفل ثاني

---

## ⚙️ إعادة تعيين البريد الإلكتروني للمستخدمين

إذا كان لديك مستخدمين حقيقيين وتريد تحديث بريدهم الإلكتروني:

### الطريقة 1: يدوياً من MongoDB

```javascript
// تحديث بريد مستخدم معين
db.users.updateOne(
  { _id: ObjectId("USER_ID_HERE") },
  { $set: { email: "real.email@example.com" } }
);
```

### الطريقة 2: إنشاء endpoint مؤقت للتحديث

أضف هذا في `authController.js` (مؤقتاً - للترحيل فقط):

```javascript
// TEMPORARY - للترحيل فقط
exports.updateEmail = async (req, res, next) => {
  try {
    const { newEmail } = req.body;
    
    // تحقق من أن البريد غير مستخدم
    const existing = await User.findOne({ email: newEmail.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use',
      });
    }
    
    // تحديث البريد
    await User.findByIdAndUpdate(req.user.id, {
      email: newEmail.toLowerCase()
    });
    
    res.json({
      success: true,
      message: 'Email updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
```

---

## 📧 إبلاغ المستخدمين

إذا كان لديك مستخدمين حاليين:

1. **أرسل رسالة/تنبيه** يخبرهم بالتحديث
2. **اطلب منهم تحديث بريدهم الإلكتروني** إذا كان مؤقتاً
3. **وفر تعليمات** واضحة لتسجيل الدخول بالبريد الإلكتروني

نموذج رسالة:

```
عزيزي المستخدم،

تم تحديث نظام SafeBridge لتحسين الأمان وتجربة الاستخدام. 

التغييرات الجديدة:
- تسجيل الدخول الآن باستخدام البريد الإلكتروني بدلاً من الاسم
- أولياء الأمور يستطيعون الآن متابعة عدة أطفال

إذا كان لديك بريد مؤقت (@temp-safebridge.com)، يرجى تحديثه من الإعدادات.

شكراً لاستخدامك SafeBridge!
```

---

## 🆘 حل المشاكل

### مشكلة: "Email already registered"

```javascript
// البحث عن البريد المكرر
db.users.find({ email: "duplicate@example.com" })

// حذف الحساب المكرر أو تحديث أحدهما
db.users.updateOne(
  { _id: ObjectId("DUPLICATE_ID") },
  { $set: { email: "new_email@example.com" } }
);
```

### مشكلة: مستخدم بدون email

```javascript
// إيجاد المستخدمين بدون email
db.users.find({ email: { $exists: false } })

// إضافة email يدوياً
db.users.updateOne(
  { _id: ObjectId("USER_ID") },
  { $set: { email: "user@example.com" } }
);
```

### مشكلة: ولي أمر لا يمكنه رؤية بيانات الطفل

```javascript
// التحقق من linkedChildren
db.users.findOne({ _id: ObjectId("PARENT_ID") })

// إضافة الطفل يدوياً إذا كان مفقوداً
db.users.updateOne(
  { _id: ObjectId("PARENT_ID") },
  { $push: { linkedChildren: ObjectId("CHILD_ID") } }
);
```

---

## ✅ قائمة التحقق النهائية

- [ ] نسخة احتياطية من قاعدة البيانات
- [ ] تشغيل سكريبت الترحيل
- [ ] التحقق من عدم وجود مستخدمين بدون email
- [ ] التحقق من تحويل linkedChild إلى linkedChildren
- [ ] اختبار تسجيل الدخول بالبريد الإلكتروني
- [ ] اختبار تسجيل مستخدم جديد
- [ ] اختبار ربط طفل ثاني لولي الأمر
- [ ] حذف أي endpoints مؤقتة للترحيل
- [ ] تحديث التوثيق
- [ ] إبلاغ المستخدمين بالتغييرات

---

**ملاحظة:** هذا الترحيل يجب أن يتم مرة واحدة فقط. بعد الترحيل الناجح، النظام الجديد سيعمل بشكل طبيعي.
