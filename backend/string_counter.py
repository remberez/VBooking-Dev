import os

strings = 0

django_ignore = [
    'venv',
]


def should_ignore(dirpath):
    for ignore in django_ignore:
        if ignore in dirpath.split(os.path.sep):
            return True
    return False


for dirpath, dirnames, filenames in os.walk('.'):
    if should_ignore(dirpath):
        continue

    for file in filenames:
        if file.endswith('.py'):
            file_path = os.path.join(dirpath, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                ss = f.read().split('\n')
                for s in ss:
                    if s.strip() and not s.startswith('#') and not s.startswith('"') and not s.startswith("'"):
                        strings += 1

print('Всего строк:', strings)
