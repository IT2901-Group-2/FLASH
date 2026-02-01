FROM python:3.14-slim
WORKDIR /usr/local/app

RUN apt-get update
RUN apt-get install -y git build-essential
RUN git clone https://github.com/googleapis/storage-testbench.git /usr/local/app
RUN pip install .

EXPOSE 9000
ENTRYPOINT ["python", "testbench_run.py", "0.0.0.0", "9000", "4"]
