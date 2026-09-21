const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  { from: /@\/components\/ui/g, to: '@/shared/ui' },
  { from: /@\/components\/shared/g, to: '@/shared/ui' },
  { from: /@\/store\/useAuthStore/g, to: '@/entities/user/useAuthStore' },
  { from: /@\/types\/auth/g, to: '@/entities/user/user.types' },
  { from: /@\/types\/product/g, to: '@/entities/product/product.types' },
  { from: /@\/data\/mockProducts/g, to: '@/entities/product/product.mock' },
  { from: /@\/lib\/utils/g, to: '@/shared/lib/utils' },
  { from: /@\/components\/layout/g, to: '@/app/layouts' },
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(directoryPath);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });
  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
