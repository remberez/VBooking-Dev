class FullNameCapitalizeMixin:
    def validate_name(self, value: str) -> str:
        return value.capitalize()

    def validate_surname(self, value: str) -> str:
        return value.capitalize()

    def validate_patronymic(self, value: str) -> str:
        return value.capitalize()
